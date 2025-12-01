import { CustomizationView } from '@/modules/customization/ui/views/customization-view';
import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';

const Page = () => {
  return (
    <Protect
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationView />
        </PremiumFeatureOverlay>
      }
      condition={(has) => has({ plan: 'pro' })}
    >
      
      <CustomizationView />
    </Protect>
  );
};
export default Page;
