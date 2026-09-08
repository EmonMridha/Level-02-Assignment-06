import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { AppError } from "../../utils/AppError"
import httpStatus from "http-status"

const createCheckOutSession = async (userId: string,) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                payments: true
            }
        })

        let stripeCustomerId = user.payments.find((payment) => payment.stripeCustomerId)?.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
            });

            stripeCustomerId = customer.id;
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.stripe_price_id,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/dashboard?success=true`,
            cancel_url: `${config.app_url}/dashboard?success=false`,
            metadata: {
                userId: user.id,
                month: new Date().toISOString().slice(0, 7)
            }
        })

        const payment = await tx.payment.create({
            data: {
                userId: user.id,
                amount: 0, // temporary; see note below
                currency: "BDT",
                method: "STRIPE",
                status: "PENDING",
                stripeCustomerId,
                orderId: session.id,
            },
        });

        return {
            sessionId: session.id,
            sessionUrl: session.url,
            stripeCustomerId,
            // paymentId: payment.id
        }
    })

    return transactionResult
}

const verifyPayment = async (userId: string, sessionId: string, month: string) => {

    if (!sessionId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Session ID is required"
        );
    }

    // Get the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);


    // Verify that this session belongs to the logged-in user
    if (session.metadata?.userId !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not authorized to verify this payment"
        );
    }

    // Check whether payment was completed
    if (session.payment_status !== "paid") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Payment has not been completed"
        );
    }

    // Get subscription ID
    const subscriptionId = session.subscription as string;

    // Prevent duplicate payment
    const existingPayment = await prisma.payment.findFirst({
        where: {
            orderId: session.id,
            status: "COMPLETED"
        }
    });

    if (existingPayment) {
        throw new AppError(
            httpStatus.CONFLICT,
            "Payment has already been recorded"
        );
    }

    const payment = await prisma.payment.update({
        where: {
            orderId: session.id
        },
        data: {
            amount: Number(session.amount_total ?? 0) / 100,
            currency: "BDT",
            payingMonth: month,
            method: "STRIPE",
            status: "COMPLETED",
            transactionId: session.payment_intent as string | null,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            gatewayResponse: session as any,
        }
    });
    return payment;
};



export const paymentService = {
    createCheckOutSession,
    verifyPayment
}