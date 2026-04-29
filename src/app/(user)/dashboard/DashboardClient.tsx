'use client';
import { use } from 'react';
import Link from 'next/link';

import { dashboardHelpers } from './helpers';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate: string | null;
  subscriptionEndDateTime: string | null;
  audioListenTime: number;
  createdAt: string;
}

export interface SubscriptionOrder {
  id: number;
  planType: string;
  amount: string;
  currency: string;
  orderStatus: string;
  createdAt: string;
}

interface Props {
  userPromise: Promise<User | null>;
  subscriptionOrdersPromise: Promise<SubscriptionOrder[]>;
}

const DashboardClient = ({ userPromise, subscriptionOrdersPromise }: Props) => {
  // React 19: use() unwraps the Promise and suspends the component
  // until data is ready — the <Suspense> boundary in page.tsx shows
  // the skeleton in the meantime.
  const user = use(userPromise);
  const subscriptionOrders = use(subscriptionOrdersPromise);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Unable to load user profile. Please try again.</p>
      </div>
    );
  }

  const pendingOrder = subscriptionOrders.find((o) => o.orderStatus === 'PENDING');
  const benefits = dashboardHelpers.getTierBenefits(user.subscriptionTier);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-2 py-6">
        {/* Welcome Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and track your learning progress</p>
        </div>

        {/* Pending Order Alert */}
        {pendingOrder && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-bold text-yellow-900">Payment Under Review</h3>
                <p className="text-yellow-700 mt-1">
                  Your {pendingOrder.planType} subscription payment (${pendingOrder.amount}) is being reviewed by our
                  team. You&apos;ll receive an email once your subscription is activated (usually within 24 hours).
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subscription Card */}
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-2">Current Plan</p>
                <h2 className="text-3xl font-bold">{benefits.title}</h2>
              </div>
              <div className="mb-6 pb-6 border-b border-white/20">
                <p className="text-white/80 text-sm mb-1">Status</p>
                <p className="text-xl font-semibold">
                  {user.subscriptionStatus === 'ACTIVE' ? '✓ Active' : '✗ Inactive'}
                </p>
              </div>
              {user.subscriptionEndDateTime && user.subscriptionTier !== 'LIFETIME' && (
                <>
                  <div className="mb-6 pb-6 border-b border-white/20">
                    <p className="text-white/80 text-sm mb-1">Renews On</p>
                    <p className="text-lg font-semibold">
                      {new Date(user.subscriptionEndDateTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {user.subscriptionTier === 'FREE' && (
                      <Link
                        href="/pricing"
                        className="block w-full py-3 bg-white text-indigo-600 rounded-lg font-bold text-center hover:bg-gray-100 transition-colors"
                      >
                        Upgrade to Premium
                      </Link>
                    )}
                    {user.subscriptionTier !== 'FREE' && user.subscriptionTier !== 'LIFETIME' && (
                      <Link
                        href="/pricing"
                        className="block w-full py-3 bg-white/20 text-white rounded-lg font-bold text-center hover:bg-white/30 transition-colors"
                      >
                        Change Plan
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Listen Time</span>
                  <span className="font-semibold text-gray-900">{user.audioListenTime} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Plan Includes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.features.map((feature, index) => (
                  <div className="flex items-start" key={index}>
                    <svg
                      className="w-6 h-6 text-green-600 mt-0.5 mr-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}

                {benefits.limitations.map((limitation, index) => (
                  <div className="flex items-start" key={index}>
                    <svg
                      className="w-6 h-6 text-red-500 mt-0.5 mr-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {user.subscriptionTier === 'FREE' && (
                <div className="mt-8 bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Unlock Full Access?</h3>
                  <p className="text-gray-700 mb-4">
                    Upgrade to premium and get unlimited access to 10,000+ book summaries, full audio, and PDF
                    downloads.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg"
                  >
                    View Plans & Pricing
                  </Link>
                </div>
              )}
            </div>

            {subscriptionOrders.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription History</h2>
                <div className="space-y-4">
                  {subscriptionOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{order.planType} Plan</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.amount}</p>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/books"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">📚</span>
                    <span className="font-semibold text-gray-900">Browse Books</span>
                  </div>
                  <span className="text-gray-400">{'→'}</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">❤️</span>
                    <span className="font-semibold text-gray-900">My Favorites</span>
                  </div>
                  <span className="text-gray-400">{'→'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
