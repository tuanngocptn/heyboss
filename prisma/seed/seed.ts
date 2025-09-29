import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const toxicBehaviorCategories = [
  "Verbal Abuse",
  "Micromanagement",
  "Workplace Bullying",
  "Sexual Harassment",
  "Discrimination",
  "Favoritism",
  "Unrealistic Expectations",
  "Public Humiliation",
  "Passive Aggressive",
  "Gaslighting",
  "Credit Stealing",
  "Intimidation",
  "Overworking",
  "Backstabbing",
  "Emotional Manipulation",
];

const companyNames = [
  "TechCorp Solutions",
  "Global Dynamics Inc",
  "Digital Innovations Ltd",
  "MegaCorp Industries",
  "DataStream Technologies",
  "CloudFirst Solutions",
  "NextGen Systems",
  "Enterprise Solutions LLC",
  "Innovation Hub Inc",
  "FutureTech Corp",
  "SmartSystems Ltd",
  "AgileWorks Inc",
  "TechVision Solutions",
  "Digital Transform Co",
  "CyberCore Industries",
  "InfoTech Dynamics",
  "SystemsMax Ltd",
  "TechAdvantage Inc",
  "DigitalEdge Corp",
  "InnovateTech Solutions",
];

const positions = [
  "CEO",
  "CTO",
  "VP of Engineering",
  "Engineering Manager",
  "Product Manager",
  "Team Lead",
  "Director of Operations",
  "VP of Sales",
  "Marketing Director",
  "HR Manager",
  "Project Manager",
  "Senior Manager",
  "Department Head",
  "Division Manager",
  "Regional Manager",
];

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Operations",
  "Finance",
  "Product",
  "Customer Success",
  "IT",
  "Legal",
  "Business Development",
  "Quality Assurance",
  "Research & Development",
  "Support",
  "Administration",
];

const locations = [
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Boston, MA",
  "Seattle, WA",
  "Austin, TX",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Toronto, ON",
  "Vancouver, BC",
  "London, UK",
  "Berlin, Germany",
  "Singapore",
  "Sydney, Australia",
  "Tokyo, Japan",
  "Paris, France",
  "Amsterdam, Netherlands",
  "Stockholm, Sweden",
];

const firstNames = [
  "Michael",
  "David",
  "John",
  "Robert",
  "James",
  "William",
  "Richard",
  "Thomas",
  "Christopher",
  "Daniel",
  "Sarah",
  "Jennifer",
  "Lisa",
  "Karen",
  "Susan",
  "Jessica",
  "Patricia",
  "Linda",
  "Michelle",
  "Angela",
  "Mark",
  "Paul",
  "Steven",
  "Kenneth",
  "Andrew",
  "Joshua",
  "Kevin",
  "Brian",
  "George",
  "Edward",
  "Emily",
  "Ashley",
  "Stephanie",
  "Nicole",
  "Melissa",
  "Rebecca",
  "Laura",
  "Kimberly",
  "Deborah",
  "Dorothy",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
];

const reportTemplates = [
  "constantly yells at employees during meetings and belittles their contributions in front of the entire team",
  "micromanages every small detail of work, requiring approval for basic decisions and checking up on employees every hour",
  "takes credit for team members' work and presents it as their own to upper management",
  "shows clear favoritism towards certain employees while treating others unfairly and giving them impossible deadlines",
  "uses intimidation tactics and threatens job security when employees don't comply with unreasonable demands",
  "makes inappropriate comments and creates a hostile work environment for multiple team members",
  "gaslights employees by denying previous conversations and making them question their own memory and competence",
  "publicly humiliates team members during company-wide meetings for minor mistakes",
  "assigns excessive workload with impossible deadlines and then blames employees for poor performance",
  "spreads false rumors about employees and undermines their reputation within the organization",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  console.log("🌱 Starting seed process...");

  // Clear existing data
  await prisma.toxicBoss.deleteMany({});
  console.log("🗑️  Cleared existing toxic boss records");

  const toxicBosses = [];

  for (let i = 0; i < 10000; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const bossName = `${firstName} ${lastName}`;
    const company = getRandomElement(companyNames);
    const position = getRandomElement(positions);
    const department = getRandomElement(departments);
    const location = getRandomElement(locations);
    const bornYear = Math.floor(Math.random() * (1985 - 1950 + 1)) + 1950; // Random year between 1950-1985
    const reportTemplate = getRandomElement(reportTemplates);
    const behaviorCount = Math.floor(Math.random() * 4) + 1; // 1-4 behaviors
    const categories = getRandomElements(
      toxicBehaviorCategories,
      behaviorCount
    );
    const submissionDate = generateRandomDate(
      new Date("2023-01-01"),
      new Date()
    );

    // Generate realistic email
    const emailDomain = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "company.com",
    ][Math.floor(Math.random() * 5)];
    const reporterEmail = `reporter${i + 1}@${emailDomain}`;

    const reportContent = `This manager ${reportTemplate}. The behavior has been ongoing for months and is affecting team morale and productivity. Multiple colleagues have witnessed these incidents and the work environment has become toxic and stressful.`;

    toxicBosses.push({
      bossName,
      bossCompany: company,
      bossPosition: position,
      bossDepartment: department,
      bornYear,
      workLocation: location,
      reporterEmail,
      categories,
      markdownPath: `seed.md`,
      pdfPath: `seed.pdf`,
      submissionDate,
      verified: Math.random() > 0.8, // 20% chance of being verified
      published: Math.random() > 0.9, // 10% chance of being published
      locked: Math.random() > 0.95, // 5% chance of being locked
    });
  }

  console.log("📝 Creating 10,000 toxic boss records...");

  // Batch insert for better performance
  const batchSize = 100;
  for (let i = 0; i < toxicBosses.length; i += batchSize) {
    const batch = toxicBosses.slice(i, i + batchSize);
    await prisma.toxicBoss.createMany({
      data: batch,
    });
    console.log(
      `✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        toxicBosses.length / batchSize
      )} (${i + batch.length}/${toxicBosses.length} records)`
    );
  }

  console.log("✅ Successfully seeded 10,000 toxic boss records!");

  // Show some statistics
  const totalRecords = await prisma.toxicBoss.count();
  const verifiedCount = await prisma.toxicBoss.count({
    where: { verified: true },
  });
  const publishedCount = await prisma.toxicBoss.count({
    where: { published: true },
  });
  const lockedCount = await prisma.toxicBoss.count({ where: { locked: true } });

  console.log("\n📊 Database Statistics:");
  console.log(`Total Records: ${totalRecords}`);
  console.log(`Verified Records: ${verifiedCount}`);
  console.log(`Published Records: ${publishedCount}`);
  console.log(`Locked Records: ${lockedCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
