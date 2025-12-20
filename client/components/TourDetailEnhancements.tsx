import {
  CheckCircle2,
  XCircle,
  Info,
  MapPin,
  Users,
  AlertCircle,
  Package,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TourDetailEnhancementsProps {
  included?: string[];
  notIncluded?: string[];
  accommodation?: string;
  meals?: string;
  safetyInfo?: string;
  altitudeInfo?: string;
  guideRatio?: string;
  bestSeason?: string;
  packingItems?: string[];
  faqs?: Array<{ q: string; a: string }>;
}

export default function TourDetailEnhancements({
  included = [],
  notIncluded = [],
  accommodation = "",
  meals = "",
  safetyInfo = "",
  altitudeInfo = "",
  guideRatio = "1 guide per 6-8 trekkers",
  bestSeason = "",
  packingItems = [],
  faqs = [],
}: TourDetailEnhancementsProps) {
  return (
    <div className="space-y-8">
      {/* What's Included / Not Included */}
      {(included.length > 0 || notIncluded.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {included.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-8 shadow-md">
              <h3 className="text-xl font-black text-green-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                What's Included
              </h3>
              <ul className="space-y-3">
                {included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-primary flex-shrink-0 mt-0.5" />
                    <span className="text-text-dark/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notIncluded.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-8 shadow-md">
              <h3 className="text-xl font-black text-text-dark mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-text-dark/60" />
                Not Included
              </h3>
              <ul className="space-y-3">
                {notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-text-dark/60 flex-shrink-0 mt-0.5" />
                    <span className="text-text-dark/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Accommodation & Meals */}
      {(accommodation || meals) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accommodation && (
            <div className="bg-card rounded-lg border border-border p-8 shadow-md">
              <h3 className="text-lg font-black text-green-primary mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Accommodation
              </h3>
              <p className="text-text-dark/70 leading-relaxed text-sm">
                {accommodation}
              </p>
            </div>
          )}

          {meals && (
            <div className="bg-card rounded-lg border border-border p-8 shadow-md">
              <h3 className="text-lg font-black text-green-primary mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Meals & Diet
              </h3>
              <p className="text-text-dark/70 leading-relaxed text-sm">
                {meals}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Safety & Altitude Info */}
      {(safetyInfo || altitudeInfo || guideRatio) && (
        <div className="bg-card rounded-lg border border-border p-8 shadow-md">
          <h3 className="text-lg font-black text-green-primary mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Safety & Trek Details
          </h3>

          <div className="space-y-6">
            {safetyInfo && (
              <div>
                <h4 className="font-bold text-text-dark mb-2">
                  Safety Information
                </h4>
                <p className="text-text-dark/70 text-sm leading-relaxed">
                  {safetyInfo}
                </p>
              </div>
            )}

            {altitudeInfo && (
              <div>
                <h4 className="font-bold text-text-dark mb-2">
                  Altitude Information
                </h4>
                <p className="text-text-dark/70 text-sm leading-relaxed">
                  {altitudeInfo}
                </p>
              </div>
            )}

            {guideRatio && (
              <div>
                <h4 className="font-bold text-text-dark mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-primary" />
                  Guide-to-Trekker Ratio
                </h4>
                <p className="text-text-dark/70 text-sm">{guideRatio}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Packing Checklist */}
      {packingItems.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-8 shadow-md">
          <h3 className="text-lg font-black text-green-primary mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packing Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {packingItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-primary rounded-full flex-shrink-0"></div>
                <span className="text-text-dark/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Season */}
      {bestSeason && (
        <div className="bg-background rounded-lg border border-border p-8">
          <h3 className="text-lg font-black text-green-primary mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Best Time to Visit
          </h3>
          <p className="text-text-dark/70 text-sm">{bestSeason}</p>
        </div>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-8 shadow-md">
          <h3 className="text-lg font-black text-green-primary mb-6">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="text-left font-semibold text-text-dark hover:no-underline hover:text-green-primary py-3">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-text-dark/70 text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
