import { prisma } from '../../../../../lib/db/prisma';

export async function getSubscriptionOrders(userId: string) {
  const orders = await prisma.subscriptionOrder.findMany({
    where: { userId },
    select: {
      id: true,
      planType: true,
      amount: true,
      currency: true,
      orderStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => ({
    ...order,
    amount: order.amount.toString(),
    planType: order.planType.toString(),
    orderStatus: order.orderStatus.toString(),
    createdAt: order.createdAt.toISOString(),
  }));
}
