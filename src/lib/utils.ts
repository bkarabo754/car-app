import { format } from 'date-fns';
import { ClassifiedFilterSchema } from '@/app/schemas/classified.schema';
import { AwaitedPageProps } from '@/config/types';
import {
  BodyType,
  ClassifiedStatus,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Prisma,
  Transmission,
  ULEZCompliance,
} from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { parse } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.MILES ? 'mi' : 'km';
  format;
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? 'Automatic' : 'Manual';
}

export function formatFuelType(fuelType: FuelType) {
  switch (fuelType) {
    case FuelType.PETROL:
      return 'Petrol';
    case FuelType.DIESEL:
      return 'Diesel';
    case FuelType.ELECTRIC:
      return 'Electric';
    case FuelType.HYBRID:
      return 'Hybrid';
    default:
      return 'Unknown';
  }
}

export function formatColour(colour: Colour) {
  switch (colour) {
    case Colour.BLACK:
      return 'Black';
    case Colour.WHITE:
      return 'White';
    case Colour.SILVER:
      return 'Silver';
    case Colour.RED:
      return 'Red';
    case Colour.BLUE:
      return 'Blue';
    case Colour.BROWN:
      return 'Brown';
    case Colour.GOLD:
      return 'Gold';
    case Colour.GREEN:
      return 'Green';
    case Colour.GREY:
      return 'Grey';
    case Colour.ORANGE:
      return 'Orange';
    case Colour.PINK:
      return 'Pink';
    case Colour.PURPLE:
      return 'Purple';
    case Colour.YELLOW:
      return 'Yellow';
    default:
      return 'Unknown';
  }
}

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps['searchParams'] | undefined
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);

  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ['make', 'model', 'modelVariant'];

  const rangeFilters = {
    minYear: 'year',
    maxYear: 'year',
    minPrice: 'price',
    maxPrice: 'price',
    minReading: 'odoReading',
    maxReading: 'odoReading',
  };

  const numFilters = ['seats', 'doors'];
  const enumFilters = [
    'odoUnit',
    'currency',
    'transmission',
    'bodyType',
    'fuelType',
    'colour',
    'ulezCompliance',
  ];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined;
      if (!value) return acc;

      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) };
      } else if (enumFilters.includes(key)) {
        acc[key] = value.toUpperCase();
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters];
        acc[field] = acc[field] || {};
        if (key.startsWith('min')) {
          acc[field].gte = Number(value);
        } else if (key.startsWith('max')) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    {} as { [key: string]: any }
  );

  return {
    status: ClassifiedStatus.LIVE,

    ...(searchParams?.q
      ? {
          OR: [
            {
              title: {
                contains: searchParams.q as string,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchParams.q as string,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),

    ...mapParamsToFields,
  };
};

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: format(date, 'dd MMM yyyy'),
      value: format(date, 'dd MMM yyyy'),
    });
  }
  return dates;
};

export const formatDate = (date: string, time: string) => {
  const parsedDate = parse(date, 'dd MMM yyyy', new Date());
  const parsedTime = parse(time, 'hh:mm aa', new Date());

  parsedDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  return parsedDate;
};

interface FormatPriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatUlezCompliance(ulezCompliance: ULEZCompliance) {
  return ulezCompliance === ULEZCompliance.EXEMPT ? 'Exempt' : 'Non-Exempt';
}

export function formatBodyType(bodyType: BodyType) {
  switch (bodyType) {
    case BodyType.CONVERTIBLE:
      return 'Convertible';
    case BodyType.COUPE:
      return 'Coupe';
    case BodyType.HATCHBACK:
      return 'Hatchback';
    case BodyType.SUV:
      return 'SUV';
    case BodyType.WAGON:
      return 'Wagon';
    case BodyType.SEDAN:
      return 'Sedan';
    default:
      return 'Unknown';
  }
}

export function formatPrice({ price, currency }: FormatPriceArgs) {
  if (!price) return '0';

  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    ...(currency && { currency }),
    maximumFractionDigits: 0,
  });

  return formatter.format(price / 100);
}

export function formatNumber(
  num: number | null,
  options?: Intl.NumberFormatOptions
) {
  if (!num) return '0';

  return new Intl.NumberFormat('en-ZA', options).format(num);
}
