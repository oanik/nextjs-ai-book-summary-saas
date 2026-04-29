import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '../../../../lib/auth';
import DashboardClient from './DashboardClient';
import DashboardSkeleton from './DashboardSkeleton';
import { getDashboardUser } from './queries/getDashboardUser';
import { getSubscriptionOrders } from './queries/getSubscriptionOrders';

const DashboardPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Start both fetches without awaiting — pass Promises directly to the
  // client component so React 19's use() can stream them in parallel.
  const userPromise = getDashboardUser(session.user.id);
  const subscriptionOrdersPromise = getSubscriptionOrders(session.user.id);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient userPromise={userPromise} subscriptionOrdersPromise={subscriptionOrdersPromise} />
    </Suspense>
  );
};

export default DashboardPage;
