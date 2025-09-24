export type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  helpText?: string;
  options?: { value: string; label: string }[];
  dependsOn?: string;
  optionsMap?: Record<string, string[]>;
  defaultValue?: string;
};

export interface FormConfig {
  pageTitle: string;
  pageDescription: string;
  submitButtonText: string;
  fields: FormField[];
  opportunityType: string;
}

const serviceCategories = {
  "Engineering & Design": ["Civil Engineering", "Structural Engineering", "Architecture & Building Design", "Surveying & Land Assessment"],
  "Construction": ["Road & Bridge Construction", "Residential & Commercial Buildings", "Renovation & Remodeling"],
  "Materials Supply": ["Cement, Sand, Gravel", "Bricks, Blocks, Stones", "Wall Tiles / Wall Chips / Paint"],
  "Finishing & Decoration": ["Interior Design", "Flooring & Ceiling Works", "Painting & Coating"],
  "Technical Services": ["Plumbing & Electrical (MEP)", "Fabrication & Welding", "Safety & Inspection"],
};

export const formConfigs: Record<string, FormConfig> = {
  job: {
    pageTitle: "Post a New Job",
    pageDescription: "Detail the role to attract the best talent in our network.",
    submitButtonText: "Publish Job Posting",
    opportunityType: "Job",
    fields: [
      { name: 'title', label: 'Job Title', placeholder: 'e.g., Senior Software Engineer', type: 'text', required: true },
      { name: 'location', label: 'Location', placeholder: 'e.g., Hargeisa, Remote', type: 'text', required: true },
      { name: 'description', label: 'Job Description', placeholder: 'Describe the role and responsibilities...', type: 'textarea', required: true },
      // --- CHANGE: Updated help text for consistency ---
      { name: 'requirements', label: 'Key Requirements', placeholder: 'e.g., Bachelor\'s Degree\n5+ years experience', type: 'textarea', helpText: 'Enter each requirement on a new line.' },
      { name: 'salary_range', label: 'Compensation / Salary Range', placeholder: 'e.g., $2500/month, Competitive', type: 'text' },
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
        { name: 'department', label: 'Department / Faculty', placeholder: 'e.g., Faculty of Computing', type: 'text', required: true },
        { name: 'description', label: 'Program Description', placeholder: 'Describe the program, curriculum, and outcomes...', type: 'textarea', required: true },
        { name: 'duration', label: 'Program Duration', placeholder: 'e.g., 4 Years, 6 Months', type: 'text' },
        // --- CHANGE: Updated help text ---
        { name: 'eligibility', label: 'Eligibility / Requirements', placeholder: 'e.g., High School Diploma\nSpecific Grades', type: 'textarea', helpText: 'Enter each requirement on a new line.' },
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
      { name: 'category', label: 'Service Category', type: 'select', required: true, placeholder: 'Select a category', options: Object.keys(serviceCategories).map(cat => ({ value: cat, label: cat })) },
      { name: 'subcategory', label: 'Subcategory', type: 'select', required: true, placeholder: 'Select a subcategory', dependsOn: 'category', optionsMap: serviceCategories, options: [] },
      { name: 'description', label: 'Service Description', placeholder: 'Describe the service, your process, and key deliverables.', type: 'textarea', required: true },
      { name: 'price', label: 'Price / Rate', placeholder: 'e.g., $50/hour, Project-based', type: 'text' },
    ],
  },
  project: {
    pageTitle: "Post a Project, Tender, or Event",
    pageDescription: "Outline your initiative to find partners, contractors, or participants.",
    submitButtonText: "Publish Initiative",
    opportunityType: "Project",
    fields: [
      { name: 'title', label: 'Title', placeholder: 'e.g., Construction of New Office Building', type: 'text', required: true },
      { name: 'type', label: 'Posting Type', placeholder: 'Select a type', type: 'select', required: true, options: [
        { value: 'Project', label: 'Project' },
        { value: 'Event', label: 'Event' },
        { value: 'Tender', label: 'Tender' },
        { value: 'Announcement', label: 'Announcement' },
        { value: 'Grant', label: 'Grant' },
      ], defaultValue: 'Project' },
      { name: 'description', label: 'Detailed Description', placeholder: 'Scope of work, objectives, deliverables...', type: 'textarea', required: true },
      { name: 'budget_range', label: 'Budget Range (Optional)', placeholder: 'e.g., $10,000 - $15,000', type: 'text' },
      // --- CHANGE: Updated help text for consistency ---
      { name: 'requirements', label: 'Requirements / Eligibility', placeholder: 'e.g., Must be a registered company', type: 'textarea', helpText: 'Enter each requirement on a new line.'},
      { name: 'end_date', label: 'Submission Deadline', placeholder: 'e.g., 2025-11-15', type: 'text', required: true },
    ],
  },
  idea: {
    pageTitle: "Submit a New Idea",
    pageDescription: "Share an idea for a new project or venture with the community.",
    submitButtonText: "Submit Idea",
    opportunityType: "Idea",
    fields: [
        { name: 'title', label: 'Idea Title', placeholder: 'e.g., Solar Powered Water Purification System', type: 'text', required: true },
        { name: 'summary', label: 'Summary (Short Pitch)', placeholder: 'A brief, one-sentence summary of your idea.', type: 'textarea', required: true },
        { name: 'details', label: 'Full Details', placeholder: 'Describe the problem, your proposed solution, and potential impact.', type: 'textarea', required: true },
        { name: 'tags', label: 'Tags / Keywords', placeholder: 'e.g., Renewable Energy, Health, Technology', type: 'text', helpText: 'Separate with commas. This helps others discover your idea.' },
    ],
  }
};
