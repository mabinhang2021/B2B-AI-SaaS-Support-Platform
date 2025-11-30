import { VapiView } from '@/modules/plugins/ui/views/vapi-view';
import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
const Page = () => {
  return (
    <Protect
      fallback={
        <PremiumFeatureOverlay>
          <VapiView />
        </PremiumFeatureOverlay>
      }
      condition={(has) => has({ plan: 'pro' })}
    >
      ;
      <VapiView />
    </Protect>
  );
};
export default Page;
