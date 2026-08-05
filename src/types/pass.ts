export type PassType = 'eventTicket' | 'boardingPass' | 'coupon' | 'storeCard' | 'generic';

export type BarcodeFormat = 'PKBarcodeFormatQR' | 'PKBarcodeFormatAztec' | 'PKBarcodeFormatPDF417' | 'PKBarcodeFormatCode128';

export interface PassField {
  id: string;
  key: string;
  label: string;
  value: string;
  changeMessage?: string;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight';
}

export interface ApplePassData {
  id: string;
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText: string;
  passType: PassType;
  
  // Color styling
  backgroundColor: string; // RGB string like "rgb(24, 28, 36)" or hex "#181c24"
  foregroundColor: string; // Text color like "#ffffff"
  labelColor: string;       // Label color like "#94a3b8"
  
  // Custom images (base64 or data URLs)
  logoImage?: string;
  stripImage?: string;
  iconImage?: string;
  
  // Fields grouped by location
  headerFields: PassField[];
  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];
  
  // Barcode / QR Code
  barcode: {
    message: string;
    format: BarcodeFormat;
    altText?: string;
    messageEncoding: string;
  };

  // Extra Boarding Pass metadata
  transitType?: 'PKTransitTypeAir' | 'PKTransitTypeTrain' | 'PKTransitTypeBus' | 'PKTransitTypeBoat' | 'PKTransitTypeGeneric';
  
  // Metadata for saved item
  createdAt: number;
  updatedAt: number;
  title: string;
}

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  passData: Partial<ApplePassData>;
  badgeText?: string;
}
