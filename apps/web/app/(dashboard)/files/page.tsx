import { FilesView } from '@/modules/files/ui/views/files-view';
import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';

const Page = () => {
  return (
    <Protect
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
      condition={(has) => has({ plan: 'pro' })}
    >
      <FilesView />
    </Protect>
  );
};
export default Page;
