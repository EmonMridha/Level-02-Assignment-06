import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

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
            metadata: { userId: user.id }
        })

        return session.url
    })

    return {
        paymentUrl: transactionResult
    }
}



export const paymentService = {
    createCheckOutSession
}