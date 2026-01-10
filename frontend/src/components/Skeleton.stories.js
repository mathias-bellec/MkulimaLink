import React from 'react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  ProductCardSkeleton,
  ProductListSkeleton,
  ChatMessageSkeleton,
  ChatListSkeleton,
  TableSkeleton,
  DashboardStatsSkeleton,
  ProfileSkeleton,
  PageLoadingSkeleton
} from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
};

export const Basic = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export const Text = () => (
  <div className="max-w-md">
    <SkeletonText lines={4} />
  </div>
);

export const Avatars = () => (
  <div className="flex gap-4 items-end">
    <SkeletonAvatar size="sm" />
    <SkeletonAvatar size="md" />
    <SkeletonAvatar size="lg" />
    <SkeletonAvatar size="xl" />
  </div>
);

export const Buttons = () => (
  <div className="flex gap-4">
    <SkeletonButton width="w-20" />
    <SkeletonButton width="w-32" />
    <SkeletonButton width="w-40" />
  </div>
);

export const Images = () => (
  <div className="grid grid-cols-3 gap-4">
    <SkeletonImage aspectRatio="aspect-square" />
    <SkeletonImage aspectRatio="aspect-video" />
    <SkeletonImage aspectRatio="aspect-[4/3]" />
  </div>
);

export const ProductCard = () => <ProductCardSkeleton />;

export const ProductList = () => <ProductListSkeleton count={6} />;

export const ChatMessage = () => (
  <div className="space-y-4 max-w-md">
    <ChatMessageSkeleton />
    <ChatMessageSkeleton isOwn />
    <ChatMessageSkeleton />
  </div>
);

export const ChatList = () => (
  <div className="max-w-md border rounded-lg">
    <ChatListSkeleton count={5} />
  </div>
);

export const Table = () => <TableSkeleton rows={5} columns={4} />;

export const DashboardStats = () => <DashboardStatsSkeleton />;

export const Profile = () => (
  <div className="max-w-md">
    <ProfileSkeleton />
  </div>
);

export const FullPage = () => <PageLoadingSkeleton />;
