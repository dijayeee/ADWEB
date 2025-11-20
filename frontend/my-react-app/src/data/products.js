import Blazers from '../Assets/Woman_wear/Women_Blazers.jpg';
import Classic from '../Assets/Woman_wear/Women_Classic.jpg';
import Leggings from '../Assets/Woman_wear/Women_Leggings.jpg';
import Evening from '../Assets/Woman_wear/Women_evening_gown.jpg';
import Designer from '../Assets/Woman_wear/Women_Designer.jpg';
import Summer from '../Assets/Woman_wear/Women_Summer.jpg';
import Floral from '../Assets/Woman_wear/Women_Floral.jpg';
import Winter from '../Assets/Woman_wear/Women_Winter.jpg';
import MenClassic from '../Assets/Men_wear/Men_Classic.jpg';
import MenCasual from '../Assets/Men_wear/Men_Casual.jpg';
import MenDenim from '../Assets/Men_wear/Men_Denim.jpg';
import MenSlimFit from '../Assets/Men_wear/Men_Slim.jpg';
import MenHoodie from '../Assets/Men_wear/Men_Hoodie.jpg';
import MenBusiness from '../Assets/Men_wear/Men_Business.jpg';
import MenAthletic from '../Assets/Men_wear/Men_Athletic.jpg';
import MenLeather from '../Assets/Men_wear/Men_Leather.jpg';
import KidsTShirt from '../Assets/Kids_wear/Kids_Tshirt.jpg';
import SchoolUniform from '../Assets/Kids_wear/Kids_Uniform.jpg';
import DenimOveralls from '../Assets/Kids_wear/Kids_Denim.jpg';
import PlaytimeDress from '../Assets/Kids_wear/Kids_Playtime.jpg';
import Sneakers from '../Assets/Kids_wear/Kids_Shoes.jpg';
import WinterJacket from '../Assets/Kids_wear/Kids_Jacket.jpg';
import SwimwearSet from '../Assets/Kids_wear/Kids_Swimsuit.jpg';
import PartyOutfit from '../Assets/Kids_wear/Kids_Partyset.jpg';
import BabyOnesie from '../Assets/Baby_wear/Baby_Onesies.jpg';
import SleepSack from '../Assets/Baby_wear/Baby_SleepSack.jpg';
import BabyRomper from '../Assets/Baby_wear/Baby_Romper.jpg';
import Pajamas from '../Assets/Baby_wear/Baby_Pajamas.jpg';
import BabyHat from '../Assets/Baby_wear/Baby_Hat.jpg';
import BabyBooties from '../Assets/Baby_wear/Baby_Booties.jpg';
import BabyBodysuit from '../Assets/Baby_wear/Baby_BodySuit.jpg';
import BabyDress from '../Assets/Baby_wear/Baby_Dress.jpg';
const products = [
  {
    id: 'w1',
    name: 'Elegant Summer Dress',
    category: 'Women',
    price: 89.99,
    image: Summer,
    colors: ['Black', 'White', 'Navy Blue', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Lightweight floral summer dress with breathable fabric and flattering fit.'
  },
  {
    id: 'w2',
    name: 'Classic Blazer',
    category: 'Women',
    price: 129.99,
    image: Blazers,
    colors: ['Black', 'Navy Blue', 'Gray', 'Beige'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Tailored blazer with structured shoulders — perfect for work or events.'
  },
  {
    id: 'w3',
    name: 'Casual T-Shirt',
    category: 'Women',
    price: 29.99,
    image: Classic,
    colors: ['White', 'Black', 'Gray', 'Pink', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Soft cotton tee with relaxed fit and durable stitching.'
  },
  {
    id: 'w4',
    name: 'Designer Jeans',
    category: 'Women',
    price: 79.99,
    image: Designer,
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['24', '26', '28', '30', '32'],
    description: 'Premium denim with stretch for comfort and flattering silhouette.'
  },
  {
    id: 'w5',
    name: 'Floral Print Top',
    category: 'Women',
    price: 49.99,
    image: Floral,
    colors: ['Floral Pink', 'Floral Blue', 'Floral White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Lightweight top with vibrant floral prints and airy sleeves.'
  },
  {
    id: 'w6',
    name: 'Winter Coat',
    category: 'Women',
    price: 149.99,
    image: Winter,
    colors: ['Black', 'Navy Blue', 'Camel', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Warm insulated coat with water-resistant shell for cold days.'
  },
  {
    id: 'w7',
    name: 'Athletic Leggings',
    category: 'Women',
    price: 39.99,
    image: Leggings,
    colors: ['Black', 'Gray', 'Navy Blue', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'High-waisted leggings with moisture-wicking fabric for workouts.'
  },
  {
    id: 'w8',
    name: 'Evening Gown',
    category: 'Women',
    price: 199.99,
    image: Evening,
    colors: ['Black', 'Navy Blue', 'Red', 'Gold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Elegant floor-length gown with sequin detailing and flattering cut.'
  },
  {
    id: 'm1',
    name: 'Classic Suit',
    category: 'Men',
    price: 299.99,
    image: MenClassic,
    colors: ['Black', 'Navy Blue', 'Gray', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Timeless tailored suit crafted from premium fabric for formal occasions.'
  },
  {
    id: 'm2',
    name: 'Casual Polo Shirt',
    category: 'Men',
    price: 39.99,
    image: MenCasual,
    colors: ['White', 'Black', 'Navy Blue', 'Gray', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Comfortable polo with breathable fabric and classic collar.'
  },
  {
    id: 'm3',
    name: 'Denim Jacket',
    category: 'Men',
    price: 89.99,
    image: MenDenim,
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic denim jacket with rugged finish and functional pockets.'
  },
  {
    id: 'm4',
    name: 'Slim Fit Jeans',
    category: 'Men',
    price: 69.99,
    image: MenSlimFit,
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Modern slim fit jeans with stretch for mobility and style.'
  },
  {
    id: 'm5',
    name: 'Hooded Sweatshirt',
    category: 'Men',
    price: 59.99,
    image: MenHoodie,
    colors: ['Black', 'Gray', 'Navy Blue', 'White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Cozy hoodie with soft fleece lining and adjustable drawstring.'
  },
  {
    id: 'm6',
    name: 'Business Shirt',
    category: 'Men',
    price: 49.99,
    image: MenBusiness,
    colors: ['White', 'Light Blue', 'Pink', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Crisp business shirt with wrinkle-resistant fabric for the office.'
  },
  {
    id: 'm7',
    name: 'Athletic Shorts',
    category: 'Men',
    price: 34.99,
    image: MenAthletic,
    colors: ['Black', 'Gray', 'Navy Blue', 'Red'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Lightweight shorts with breathable mesh panels for training.'
  },
  {
    id: 'm8',
    name: 'Leather Jacket',
    category: 'Men',
    price: 199.99,
    image: MenLeather,
    colors: ['Black', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium genuine leather jacket with classic biker styling.'
  },
  {
    id: 'k1',
    name: 'Kids T-Shirt',
    category: 'Kids',
    price: 19.99,
    image: KidsTShirt,
    colors: ['Red', 'Blue', 'Yellow', 'Green', 'Pink'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Soft cotton tee designed for playtime and everyday comfort.'
  },
  {
    id: 'k2',
    name: 'School Uniform',
    category: 'Kids',
    price: 39.99,
    image: SchoolUniform,
    colors: ['Navy Blue', 'White', 'Gray'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Durable school uniform made for long-lasting wear and easy care.'
  },
  {
    id: 'k3',
    name: 'Denim Overalls',
    category: 'Kids',
    price: 34.99,
    image: DenimOveralls,
    colors: ['Blue', 'Light Blue'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Sturdy denim overalls with adjustable straps for growing kids.'
  },
  {
    id: 'k4',
    name: 'Playtime Dress',
    category: 'Kids',
    price: 29.99,
    image: PlaytimeDress,
    colors: ['Pink', 'Purple', 'Yellow', 'Blue'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Cute and comfortable dress designed for play and special occasions.'
  },
  {
    id: 'k5',
    name: 'Shoes',
    category: 'Kids',
    price: 49.99,
    image: Sneakers,    
    colors: ['White', 'Black', 'Pink', 'Blue'],
    sizes: ['4', '5', '6', '7', '8'],
    description: 'Durable kids shoes with grippy soles for safe play.'
  },
  {
    id: 'k6',
    name: 'Winter Jacket',
    category: 'Kids',
    price: 59.99,
    image: WinterJacket,
    colors: ['Red', 'Blue', 'Black', 'Pink'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Warm insulated jacket to keep kids cozy in cold weather.'
  },
  {
    id: 'k7',
    name: 'Swimwear Set',
    category: 'Kids',
    price: 24.99,
    image: SwimwearSet,
    colors: ['Blue', 'Pink', 'Yellow', 'Green'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Colorful swimwear set with UV protection for beach days.'
  },
  {
    id: 'k8',
    name: 'Party Outfit Set',
    category: 'Kids',
    price: 44.99,
    image: PartyOutfit,
    colors: ['Pink', 'Purple', 'Blue', 'Red'],
    sizes: ['4', '6', '8', '10', '12'],
    description: 'Stylish party outfit set for celebrations and special events.'
  },
  {
    id: 'b1',
    name: 'Baby Onesie',
    category: 'Baby',
    price: 14.99,
    image: BabyOnesie,
    colors: ['White', 'Pink', 'Blue', 'Yellow', 'Gray'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    description: 'Soft snap-front onesie perfect for newborns and infants.'
  },
  {
    id: 'b2',
    name: 'Sleep Sack',
    category: 'Baby',
    price: 24.99,
    image: SleepSack,
    colors: ['Pink', 'Blue', 'Yellow', 'White', 'Gray'],
    sizes: ['Small', 'Medium', 'Large'],
    description: 'Safe wearable blanket for cozy and secure sleeping.'
  },
  {
    id: 'b3',
    name: 'Baby Romper',
    category: 'Baby',
    price: 19.99,
    image: BabyRomper,
    colors: ['White', 'Pink', 'Blue', 'Yellow', 'Green'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    description: 'Cute one-piece romper for active babies with easy diaper access.'
  },
  {
    id: 'b4',
    name: 'Pajamas',
    category: 'Baby',
    price: 16.99,
    image: Pajamas,
    colors: ['Pink', 'Blue', 'White', 'Yellow'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    description: 'Cozy two-piece pajamas for restful baby sleep.'
  },
  {
    id: 'b5',
    name: 'Baby Hat & Mittens',
    category: 'Baby',
    price: 12.99,
    image: BabyHat,
    colors: ['Pink', 'Blue', 'White', 'Gray'],
    sizes: ['0-6M', '6-12M', '12-18M'],
    description: 'Warm hat and mittens set for cold weather protection.'
  },
  {
    id: 'b6',
    name: 'Baby Booties',
    category: 'Baby',
    price: 9.99,
    image: BabyBooties,
    colors: ['White', 'Pink', 'Blue', 'Gray'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    description: 'Soft booties to keep tiny feet warm and comfortable.'
  },
  {
    id: 'b7',
    name: 'Baby Bodysuit Set',
    category: 'Baby',
    price: 22.99,
    image: BabyBodysuit,
    colors: ['White', 'Pink', 'Blue', 'Yellow'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    description: 'Multi-pack bodysuits for everyday layering and play.'
  },
  {
    id: 'b8',
    name: 'Baby Dress',
    category: 'Baby',
    price: 18.99,
    image: BabyDress,
    colors: ['Pink', 'Yellow', 'White', 'Purple'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    description: 'Cute dress for baby girls with soft fabric and adorable details.'
  },
];

export default products;

