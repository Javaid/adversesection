const doctorData = [
  {
    id: "0",
    name: "Dr. Sarah Elizabeth Mitchell, MD, FACP",
    npi: "1234567890",
    speciality: "Internal Medicine",
    status: "Active",
    Mips:"92.5/100",
    payment:"$45.7k",
    medicare:"Active",
    RiskLevel: "low",

    overview: {
      providerType: "Individual",
      specialties: ["Internal Medicine", "Geriatric Medicine"],
      taxonomyCodes: ["207R00000X", "207RG0100X"],
      clinicalExpertise: [
        "Diabetes Management",
        "Hypertension",
        "Preventive Care",
      ],
      titles: ["Attending Physician", "Medical Director"],
      degrees: ["MD", "FACP"],

      compliance: [
        {
          source: "OIG",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
        {
          source: "SAM.gov",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
        {
          source: "FDA",
          actionType: "Warning Letter",
          reason: "Clinical Trial Protocol Deviation",
          effectiveDate: "2022-08-15",
          status: "Resolved",
        },
        {
          source: "NY State Medical Board",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
      ],
      identifiers: {
        npi: "1234567890",
        pacId: "PAC123456789",
        taxId: "XX-XXX1234",
        medicareEnrollmentId: "I20040512001234",
        medicaidEnrollmentId: "MCD-NY-456789",
        otherIds: ["DEA: BM1234567", "UPIN: A12345"],
      },
      licenses: [
        {
          state: "New York",
          license: "MD-234567",
          status: "Active",
          expiryDate: "2025-03-14",
        },
        {
          state: "California",
          licenseNumber: "A89012",
          status: "Active",
          expiryDate: "2024-05-31",
        },
        {
          state: "New Jersey",
          licenseNumber: "MA45678",
          status: "Pending Renewal",
          expiryDate: "2024-09-19",
        },
      ],
       primaryLocation: {
    name: "Manhattan Internal Medicine Associates",
    address: "450 East 63rd Street, Suite 1200",
    city: "New York",
    state: "NY",
    zip: "10065",
    phone: "(212) 555-0123",
    fax: "(212) 555-0124",
    email: "dr.mitchell@mimassociates.com",
  },
  
  secondaryLocations: [
    {
       name: "NYU Langone Health",
        address: "550 First Avenue, New York, NY 10016"
       },
    { 
      name: "Bellevue Hospital Center",
       address: "462 First Avenue, New York, NY 10016" 
      },
  ],
  education: [
    { 
      type: "Medical School",
       institution: "Johns Hopkins University School of Medicine",
       year: "2008"
       },
    {
       type: "Residency",
        institution: "Massachusetts General Hospital",
        year: "2011", specialty: "Internal Medicine" 
      },
    { 
      type: "Fellowship", 
      institution: "Brigham and Women's Hospital",
      year: "2013",
       specialty: "Geriatric Medicine"
       },
    { 
      type: "Board Certification",
      institution: "ABIM", 
      year: "2011", 
      specialty: "Internal Medicine",
       status: "Current"
       },
    {
      type: "Board Certification",
       institution: "ABIM",
        year: "2013", 
        specialty: "Geriatric Medicine",
         status: "Current" 
        },
  ],
  clinicalTrials: [
    {
      name: "CLARITY-AD Extension Study",
      role: "Principal Investigator",
      sponsor: "Eisai Inc.",
      status: "Recruiting" 
    },
    {
       name: "CardioVascular Outcomes Study",
       role: "Co-Investigator",
       sponsor: "Novo Nordisk",
       status: "Completed"
      },
  ],
  
  publications: [
    {
      title: "Advances in Geriatric Diabetes Management",
      journal: "JAMA Internal Medicine",
      year: "2023", 
      pmid: "37123456"
    },
    {
      title: "Preventive Care Strategies in Elderly Populations",
      journal: "Annals of Internal Medicine",
      year: "2022",
      pmid: "35987654"
    },
  ],
   payments: {
    total2023: 45678.90,
    total2022: 38234.50,
    total2021: 29876.00,
    categories: [
      { name: "Consulting Fees", amount: 25000 },
      { name: "Speaking Fees", amount: 15000 },
      { name: "Food & Beverage", amount: 3500 },
      { name: "Travel", amount: 2178.90 },
    ],
  },
  
  mipsScore: {
    current: 92.5,
    trend: [
      { year: "2021", score: 88.2 },
      { year: "2022", score: 90.1 },
      { year: "2023", score: 92.5 },
    ],
  },

    },
  },

  {
    id: "1",
    name: "Dr. James Robert Chen, MD, PhD",
    npi: "9876543210",
    speciality: "Cardiology",
    status: "Active",
    Mips:"78.3/100",
    payment:"$89.2k",
    medicare:"Active",
    RiskLevel: "review",

    overview: {
      providerType: "Individual",
      specialties: ["Cardiology", "Interventional Cardiology"],
      taxonomyCodes: ["207RC0000X", "207RI0011X"],
      clinicalExpertise: [
        "Cardiac Catheterization",
        "Stent Placement",
        "Heart Failure Management",
      ],
      titles: ["Interventional Cardiologist", "Department Chair"],
      degrees: ["MD", "FACP"],

      compliance: [
        {
          source: "OIG",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
        {
          source: "SAM.gov",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },

        {
          source: "CA Medical Board",
          actionType: "Pending Review",
          reason: "Documenttaion Audit",
          effectiveDate: "2024-01-15",
          status: "- Under Review",
        },
      ],
        identifiers: {
        npi: "9876543210",
        pacId: "PAC987654321",
        taxId: "XX-XXX5678",
        medicareEnrollmentId: "I20050623002345",
        medicaidEnrollmentId: "MCD-CA-789012",
        otherIds: ["DEA: BC2345678", "UPIN: B23456"],
      },
  licenses: [
        {
          state: "California",
          license: "G78901",
          status: "Active",
          expiryDate: "2025-05-9",
        },
        {
          state: "Oregon",
          licenseNumber: "MD56789",
          status: "Active",
          expiryDate: "2024-08-14",
        },

      ],
        primaryLocation: {
    name: "Body Area Cardiology Group",
    address: "1200 California Street, Suite 400",
    city: "San Francisco",
    state: "CA",
    zip: "94109",
    phone: "(415) 555-0198",
    fax: "(415) 555-0199",
    email: "dr.chen@bayareacardiology.com",
  },
  
  secondaryLocations: [
    {
       name: "UCSF Medical Center",
        address: "505 Paranassus Ave, San Francisco, CA 94143"
       },

  ],
  education: [
    { 
      type: "Medical School",
       institution: "Stanford University School of Medicine ",
       year: "2005"
       },
    {
       type: "Residency  ",
        institution: "UCLA Medical Center",
        year: "2008",
        specialty: "Internal Medicine" 
      },
    { 
      type: "Fellowship", 
      institution: "Cleveland Clinic",
      year: "2011",
       specialty: "Cardiology"
       },
    { 
      type: "Board Certification",
      institution: "ABIM", 
      year: "2011", 
      specialty: "Cardiovascular Disease",
       status: "Current"
       },
   
  ],
  clinicalTrials: [
    {
      name: "TAVR Long-term Outcomes Study",
      role: "Principal Investigator",
      sponsor: "Edwards Lifesciences",
      status: "Active" 
    },
   
  ],
  
  publications: [
    {
      title: "Novel Approaches in Interventional Cardiology",
      journal: "Circulation",
      year: "2023", 
      pmid: "38234567"
    },
    
  ],
   payments: {
      total2023: 89234.50,
      total2022: 72100.00,
      total2021: 65432.00,
      categories: [
        { name: "Consulting Fees", amount: 55000 },
        { name: "Speaking Fees", amount: 28000 },
        { name: "Food & Beverage", amount: 4234.50 },
        { name: "Travel", amount: 2000 },
      ],
    },
    
    mipsScore: {
      current: 78.3,
      trend: [
        { year: "2021", score: 72.5 },
        { year: "2022", score: 75.8 },
        { year: "2023", score: 78.3 },
      ],
    },

    },
  },

  {
    id: "2",
    name: "Dr.Maria Elena Rodriguez, DO, FACOG",
    npi: "5678901234",
    speciality: "Obstetrics & Gynecology",
    status: "Active",
    Mips:"95.2/100",
    payment:"$12.5k",
    medicare:"Active",
    RiskLevel: "low",

    overview: {
      providerType: "Individual",
      specialties: ["Obstetrics & Gynecology", "Maternal-Fetal Medicine"],
      taxonomyCodes: ["207V00000X", "207VM0101X"],
      clinicalExpertise: [
        "High-Risk Pregnancy",
        "Prenatal Care",
        "Gynecologic Surgery",
      ],
      titles: ["Attending Physician", "Clinical Professor"],
      degrees: ["DO", "FACOG"],

      compliance: [
        {
          source: "OIG",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
        {
          source: "SAM.gov",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },

        {
          source: "TX Medical Board",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
      ],
         identifiers: {
        npi: "5678901234",
        pacId: "PAC567890123",
        taxId: "XX-XXX9012",
        medicareEnrollmentId:"I20080915003456",
        medicaidEnrollmentId: "MCD-TX-345678",
        otherIds: ["DEA: MR3456789"],
      },
  licenses: [
        {
          state: "Texas",
          license: "P45678",
          status: "Active",
          expiryDate: "2025-07-19",
        },
        {
          state: "Arizona",
          licenseNumber: "DO-12345",
          status: "Active",
          expiryDate: "2024-02-28",
        },

      ],
        primaryLocation: {
    name: "Houston Women's Health Center",
    address: "6550 Fannia Street, Suite 800",
    city: "Houston",
    state: "TX",
    zip: "77030",
    phone: "(713) 555-0234",
    fax: "(713) 555-0235",
    email: "dr.rodriguez@houstonwomenshealth.com",
  },
  
  secondaryLocations: [
    {
       name: "Texas Medical Center",
        address: "7200 Cambridges St, Houston, TX 77030"
       },
    { 
      name: "Memorial Hermann Hospital",
       address: "6411 Fannin St, Houston, TX 77030" 
      },
  ],
  education: [
    { 
      type: "Medical School",
       institution: "UI Health San Antonio",
       year: "2010"
       },
    {
       type: "Residency",
        institution: "Baylor College of Medicine",
        year: "2014", 
        specialty: "Obstetrics & Gynecology" 
      },
    { 
      type: "Fellowship", 
      institution: "Johns Hopkins Hospital",
      year: "2017",
       specialty: "Mternal- Fetal Medicine"
       },
    { 
      type: "Board Certification",
      institution: "ABOG", 
      year: "2014", 
      specialty: "Obstetrics & Gynecology",
       status: "Current"
       },
   
  ],
  clinicalTrials: [],
  
  publications: [
    {
      title: "Advances in High-Risk Pregnancy Management",
      journal: "American Journal of Obstetrics & Gynecology",
      year: "2022", 
      pmid: "35123456"
    },
    
  ],
payments: {
      total2023: 12500.00,
      total2022: 10800.00,
      total2021: 9200.00,
      categories: [
        { name: "Speaking Fees", amount: 8000 },
        { name: "Food & Beverage", amount: 3200 },
        { name: "Travel", amount: 1300 },
      ],
    },
    
    mipsScore: {
      current: 95.2,
      trend: [
        { year: "2021", score: 91.0 },
        { year: "2022", score: 93.5 },
        { year: "2023", score: 95.2 },
      ],
    },
    },
  },
  {
    id: "3",
    name: "Dr.William Thomas Anderson, MD",
    npi: "3456789012",
    speciality: "Orthopedic Surgery",
    status: "Inactive",
    Mips:"0/100",
    payment:"$0.0k",
    medicare:"Active",
    RiskLevel: "high",

    overview: {
      providerType: "Individual",
      specialties: ["Orthopedic Surgery", "Sports Medicine"],
      taxonomyCodes: ["207X00000X", "207XX0004X"],
      clinicalExpertise: ["Joint Replacement", "ACL Repair", "Sports Injuries"],
      titles: ["Orthopedic Surgeon"],
      degrees: ["MD"],

      compliance: [
        {
          source: "OIG",
          actionType: "Exclusion",
          reason: "Medical Fraud",
          effectiveDate: "2023-06-15",
          status: "Excluded",
        },
        {
          source: "SAM.gov",
          actionType: "Debartment",
          reason: "False Claims Act Violation",
          effectiveDate: "2023-06-20",
          status: "Active",
        },

        {
          source: "FL Medical Board",
          actionType: "License Suspension",
          reason: "Under Investigation",
          effectiveDate: "2023-05-01",
          status: "Active",
        },
      ],
        identifiers: {
        npi: "3456789012",
        pacId: "PAC345678901",
        taxId: "XX-XXX3456",
        medicareEnrollmentId:"I20030412001234",
        medicaidEnrollmentId: "MCD-FL-567890",
        otherIds: ["DEA: BA4567890"],
      },
  licenses: [
        {
          state: "Florida",
          license: "ME78901",
          status: "Suspended",
          expiryDate: "2023-4-11",
        },
    

      ],
        primaryLocation: {
    name: "Florida Orthopedic Associates (CLOSED)",
    address: "4500 S.Tamiami Trail, Suite 100",
    city: "Sarasota,",
    state: "FL",
    zip: "34231",
    phone: "(941) 555-0345",
    fax: "(941) 555-0346",
    email: "info@floridaortho.com",
  },
  
  secondaryLocations: [
   
  ],
  education: [
    { 
      type: "Medical School",
       institution: "University of  Miller School of Medicine",
       year: "2000"
       },
    {
       type: "Residency",
        institution: "Duke University Medical Center",
        year: "2005", 
        specialty: "Orthopedic Surgery" 
      },
    { 
      type: "Board Certification", 
      institution: "ABOS",
      year: "2006",
       specialty: "Orthopedic Surgery",
       status:"Expired"
       },
   
   
  ],
  clinicalTrials: [],
  
  publications: [],
      payments: {
      total2023: 0,
      total2022: 125000.00,
      total2021: 145000.00,
      categories: [],
    },
    
    mipsScore: {
      current: 0,
      trend: [
        { year: "2021", score: 68.5 },
        { year: "2022", score: 45.2 },
        { year: "2023", score: 0 },
      ],
    },
    },
  },
  {
    id: "4",
    name: "Dr.Patricia Ann Thompson, MD,MPH",
    npi: "4567890123",
    speciality: "Family Medicine",
    status: "Active",
    Mips:"88.7/100",
    payment:"$3.2k",
    medicare:"Active",
    RiskLevel: "low",

    overview: {
      providerType: "Individual",
      specialties: ["Family Medicine", "Public Health"],
      taxonomyCodes: ["207Q00000X"],
      clinicalExpertise: [
        "Preventive Care",
        "Chronic Disease Management",
        "Community Health",
      ],
      titles: ["Family Physician", "Public Health Officer"],
      degrees: ["MD"],

      compliance: [
        {
          source: "OIG",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
        {
          source: "SAM.gov",
          actionType: "None",
          reason: "N/A",
          effectiveDate: "-",
          status: "Clear",
        },
      ],
       identifiers: {
        npi: "4567890123",
        pacId: "PAC456789012",
        taxId: "XX-XXX7890",
        medicareEnrollmentId:"I20100728004567",
        medicaidEnrollmentId: "MCD-WA-901234",
        otherIds: ["DEA: PT5678901"],
      },
  licenses: [
        {
          state: "Washington",
          license: "MD60123",
          status: "Active",
          expiryDate: "2026-9-11",
        },
    

      ],
        primaryLocation: {
    name: "Seattle Community Health Center",
    address: "1200 12th Ave S",
    city: "Seattle,",
    state: "WA",
    zip: "98144",
    phone: "(206) 555-0456",
    fax: "(206) 555-0457",
    email: "dr.thompson@seattlechc.org",
  },
  
  secondaryLocations: [
    {
       name: "Harborview Medical Center",
        address: "325 9th Ave, Seattle, WA 98104"
       },
  
  ],
  education: [
    { 
      type: "Medical School",
       institution: "University of Washington School of Medicine ",
       year: "2012"
       },
    {
       type: "Residency",
        institution: "Swedish Medical Center",
        year: "2015", 
        specialty: "Family Medicine" 
      },
    { 
      type: "Board Certification", 
      institution: "ABFM",
      year: "2015",
       specialty: "Family Medicine",
       status:"Current"
       },
   
   
  ],
  clinicalTrials: [],
  
  publications: [],
 payments: {
      total2023: 3200.00,
      total2022: 2800.00,
      total2021: 2100.00,
      categories: [
        { name: "Food & Beverage", amount: 2200 },
        { name: "Travel", amount: 1000 },
      ],
    },
    
    mipsScore: {
      current: 88.7,
      trend: [
        { year: "2021", score: 85.2 },
        { year: "2022", score: 87.1 },
        { year: "2023", score: 88.7 },
      ],
    },
    },
  },
];

export default doctorData;
