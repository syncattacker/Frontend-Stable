'use client';

import { withAuth } from '@/utils/withAuth';

function CreatorLayout({ children }) {
    return <>{children}</>;
}

export default withAuth(CreatorLayout);