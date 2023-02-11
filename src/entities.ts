export type THouseObject = {
  uuid: string | null | undefined;
  address: string | null | undefined;
  postalCode: string | null | undefined;
  rentalPrice: number | null;
  askingPrice: number | null;
  floorArea: number | null;
  roomCount?: number | null;
  availabilityStatus: string | null | undefined;
  realEstate: string | null | undefined;
  latitude: number | null;
  longitude: number | null;
  image: string | null | undefined;
  url: string | null | undefined;
  forSale: boolean | null;
};

export type TRealEstateAgent = {
  name: string;
  id?: number;
};
