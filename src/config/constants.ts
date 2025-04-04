import { routes } from './routes';

export const imageSources = {
  classifiedPlaceholder:
    'https://majestic-motors.s3.us-east-1.amazonaws.com/uploads/classified-placeholder+(1).jpeg',
};

export const CLASSIFIEDS_PER_PAGE = 3;

export const navLinks = [
  { id: 1, href: routes.home, label: 'Home' },
  { id: 2, href: routes.inventory, label: 'Inventory' },
];
