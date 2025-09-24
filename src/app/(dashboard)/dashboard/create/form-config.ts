// app/dashboard/create/form-config.ts

// Define the type for a single form field
export type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  helpText?: string;
  // For select fields
  options?: { value: string; label: string }[];
  // For dependent select fields
  dependsOn?: string;
  optionsMap?: Record<string, string[]>;
  defaultValue?: string;
};

// Define the type for the entire form configuration
export interface FormConfig {
  pageTitle: string;
  pageDescription: string;
  submitButtonText: string;
  fields: FormField[];
  opportunityType: string;
}

// The detailed service categories for the Engineering/Construction sector
const serviceCategories = {
  "Engineering & Design": ["Civil Engineering", "Structural Engineering", "Architecture & Building Design", "Surveying & Land Assessment"],
  "Construction": ["Road & Bridge Construction", "Residential & Commercial Buildings", "Renovation & Remodeling"],
  "Materials Supply": ["Cement, Sand, Gravel", "Bricks, Blocks, Stones", "Wall Tiles / Wall Chips / Paint"],
  "Finishing & Decoration": ["Interior Design", "Flooring & Ceiling Works", "Painting & Coating"],
  "Technical Services": ["Plumbing & Electrical (MEP)", "Fabrication & Welding", "Safety & Inspection"],
};

// The single source of truth for all form configurations
export const formConfigs: Record<string, FormConfig> = {
  job: {
    pageTitle: "Post a New Job",
    pageDescription: "Detail the role to attract the best talent in our network.",
    submitButtonText: "Publish Job Posting",
    opportunityType: "Job",
    fields: [
      { name: 'title', label: 'Job Title', placeholder: 'e.g., Senior Marketing Manager', type: 'text', required: true },
      { name: 'location', label: 'Location', placeholder: 'e.g., Hargeisa, Remote', type: 'text', required: true },
      { name: 'description', label: 'Job Description', placeholder: 'Describe the role, responsibilities, culture, and benefits...', type: 'textarea', required: true },
      { name: 'requirements', label: 'Key Requirements', placeholder: 'e.g., Bachelor\'s Degree, 5+ years experience', type: 'textarea', helpText: 'Separate each requirement with a comma.' },
      { name: 'compensation', label: 'Compensation / Salary Range', placeholder: 'e.g., $2500/month, Competitive', type: 'text' },
      { name: 'deadline', label: 'Application Deadline (Optional)', placeholder: 'e.g., 2025-12-31', type: 'text' },
    ],
  },
  program: {
    pageTitle: "Add a New Program",
    pageDescription: "Provide details about an academic or professional program.",
    submitButtonText: "Add Program",
    opportunityType: "Program",
    fields: [
        { name: 'title', label: 'Program Name', placeholder: 'e.g., B.Sc. in Computer Science', type: 'text', required: true },
        { name: 'category', label: 'Department / Faculty', placeholder: 'e.g., Faculty of Computing', type: 'text', required: true },
        { name: 'description', label: 'Program Description', placeholder: 'Describe the program, curriculum, and outcomes...', type: 'textarea', required: true },
        { name: 'duration', label: 'Program Duration', placeholder: 'e.g., 4 Years, 6 Months', type: 'text' },
        { name: 'requirements', label: 'Eligibility / Requirements', placeholder: 'e.g., High School Diploma, Specific Grades', type: 'textarea', helpText: 'Separate each requirement with a comma.' },
        { name: 'deadline', label: 'Application Deadline (Optional)', placeholder: 'e.g., 2025-08-30', type: 'text' },
    ],
  },
  service: {
    pageTitle: "Offer a New Service",
    pageDescription: "Detail a professional service to feature on your public profile.",
    submitButtonText: "Publish Service",
    opportunityType: "Service",
    fields: [
      { name: 'title', label: 'Service Name', placeholder: 'e.g., Commercial Building Construction', type: 'text', required: true },
      { 
        name: 'category', 
        label: 'Service Category', 
        type: 'select', 
        required: true, 
        placeholder: 'Select a category',
        options: Object.keys(serviceCategories).map(cat => ({ value: cat, label: cat }))
      },
      { 
        name: 'subcategory', 
        label: 'Subcategory', 
        type: 'select',
        required: true,
        placeholder: 'Select a subcategory',
        dependsOn: 'category', 
        optionsMap: serviceCategories,
        options: [], // Initially empty, populated by CreateForm component
      },
      { name: 'description', label: 'Service Description', placeholder: 'Describe the service, your process, and key deliverables.', type: 'textarea', required: true },
      { name: 'price', label: 'Price / Rate', placeholder: 'e.g., $50/hour, Starting from $10,000, Project-based', type: 'text' },
    ],
  },
  project: {
    pageTitle: "Post a Project, Tender, or Event",
    pageDescription: "Outline your initiative to find partners, contractors, or participants.",
    submitButtonText: "Publish Initiative",
    opportunityType: "Project",
    fields: [
      { name: 'title', label: 'Title', placeholder: 'e.g., Construction of New Office Building', type: 'text', required: true },
      { name: 'opportunity_type', label: 'Posting Type', placeholder: 'Select a type', type: 'select', required: true, options: [
        { value: 'Project', label: 'Project' },
        { value: 'Tender', label: 'Tender' },
        { value: 'Announcement', label: 'Announcement' },
        { value: 'Event', label: 'Event' },
        { value: 'Grant', label: 'Grant' },
      ], defaultValue: 'Project' },
      { name: 'description', label: 'Detailed Description', placeholder: 'Scope of work, objectives, deliverables...', type: 'textarea', required: true },
      { name: 'compensation', label: 'Budget Range (Optional)', placeholder: 'e.g., $10,000 - $15,000', type: 'text' },
      { name: 'requirements', label: 'Requirements / Eligibility', placeholder: 'e.g., Must be a registered company', type: 'textarea', helpText: 'Separate each item with a comma.'},
      { name: 'deadline', label: 'Submission Deadline', placeholder: 'e.g., 2025-11-15', type: 'text', required: true },
    ],
  }
};