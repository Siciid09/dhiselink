export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'datetime' | 'upload';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  title: string;
  opportunityType: string;
  submitButtonText: string;
  fields: FormField[];
}

export const formConfigurations: Record<string, FormConfig> = {
  'Job': {
    title: 'Create a New Job Posting',
    opportunityType: 'Job',
    submitButtonText: 'Post Job',
    fields: [
      { name: 'title', label: 'Job Title', type: 'text', required: true, placeholder: 'e.g., Senior Software Engineer' },
      { name: 'location', label: 'Location', type: 'text', required: true, placeholder: 'e.g., Hargeisa, Somalia' },
      { name: 'type', label: 'Job Type', type: 'select', required: true, options: [{ value: 'full-time', label: 'Full-Time' }, { value: 'part-time', label: 'Part-Time' }, { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' }] },
      { name: 'salary_range', label: 'Salary Range (Optional)', type: 'text', placeholder: 'e.g., $1000 - $1500 per month' },
      { name: 'short_description', label: 'Short Description', type: 'textarea', required: true, helpText: 'A brief summary that will appear in list views.' },
      { name: 'description', label: 'Full Job Description', type: 'textarea', required: true, helpText: 'Detailed responsibilities, qualifications, etc. Rich text coming in Phase 2.' },
      { name: 'requirements', label: 'Requirements', type: 'textarea', required: true, helpText: 'List key skills and experience, one per line.' },
      { name: 'tags', label: 'Tags / Keywords', type: 'text', helpText: 'Comma-separated, e.g., Tech, Engineering, Remote' },
      { name: 'deadline', label: 'Application Deadline', type: 'date' },
      { name: 'external_link', label: 'External Application Link (Optional)', type: 'text', placeholder: 'https://example.com/apply' },
      { name: 'image_url', label: 'Cover Image (Optional)', type: 'upload' },
    ],
  },
  'Service': {
    title: 'Offer a New Service',
    opportunityType: 'Service',
    submitButtonText: 'Publish Service',
    fields: [
      { name: 'title', label: 'Service Title', type: 'text', required: true },
      { name: 'short_description', label: 'Short Description', type: 'textarea', required: true, helpText: 'A brief summary of the service.' },
      { name: 'description', label: 'Full Service Description', type: 'textarea', required: true },
      { name: 'tags', label: 'Service Tags', type: 'text', helpText: 'Comma-separated, e.g., Consulting, Web Design, Marketing' },
      { name: 'image_url', label: 'Cover Image', type: 'upload', required: true },
      { name: 'gallery_images', label: 'Image Gallery', type: 'upload', helpText: 'Upload multiple images to showcase the service.' },
    ],
  },
  'Program': {
    title: 'Add a New Academic Program',
    opportunityType: 'Program',
    submitButtonText: 'Add Program',
    fields: [
      { name: 'title', label: 'Program Name', type: 'text', required: true },
      { name: 'department', label: 'Department / Faculty', type: 'text' },
      { name: 'description', label: 'Program Description', type: 'textarea', required: true },
      { name: 'eligibility_criteria', label: 'Eligibility Criteria', type: 'textarea' },
      { name: 'application_deadline', label: 'Application Deadline', type: 'date' },
      { name: 'start_date', label: 'Program Start Date', type: 'date' },
      { name: 'end_date', label: 'Program End Date', type: 'date' },
      { name: 'tags', label: 'Tags', type: 'text', helpText: 'Comma-separated, e.g., Masters, IT, Business' },
      { name: 'image_url', label: 'Program Image (Optional)', type: 'upload' },
    ]
  },
  'Idea': {
    title: 'Submit a New Idea',
    opportunityType: 'Idea',
    submitButtonText: 'Submit Idea',
    fields: [
      { name: 'title', label: 'Idea Title', type: 'text', required: true, placeholder: 'What is your big idea?' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [{value: 'Business', label: 'Business'}, {value: 'Community', label: 'Community'}, {value: 'Technology', label: 'Technology'}, {value: 'Arts', label: 'Arts'}, {value: 'Other', label: 'Other'}] },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true, helpText: 'A short, compelling overview of your idea.' },
      { name: 'details', label: 'Full Details', type: 'textarea', required: true, helpText: 'Describe your idea in detail. What problem does it solve?' },
      { name: 'seeking', label: 'What are you seeking?', type: 'text', required: true, placeholder: 'e.g., Co-founder, Funding, Mentorship, Feedback' },
      { name: 'expected_impact', label: 'Expected Impact', type: 'textarea', helpText: 'What positive change will this idea bring?' },
      { name: 'tags', label: 'Tags', type: 'text', helpText: 'Comma-separated keywords to help others find your idea.' },
      { name: 'cover_image_url', label: 'Cover Image', type: 'upload' },
    ],
  },
  'Heritage Site': {
    title: 'Add a New Heritage Site',
    opportunityType: 'Heritage Site',
    submitButtonText: 'Submit Site',
    fields: [
        { name: 'title', label: 'Site Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', required: true, options: [{value: 'Archaeological', label: 'Archaeological'}, {value: 'Historical Landmark', label: 'Historical Landmark'}, {value: 'Natural Wonder', label: 'Natural Wonder'}, {value: 'Cultural Practice', label: 'Cultural Practice'}, {value: 'Monument', label: 'Monument'}] },
        { name: 'location', label: 'Location / Address', type: 'text', required: true },
        { name: 'summary', label: 'Summary', type: 'textarea', required: true, helpText: 'A short description for list views.' },
        { name: 'description', label: 'Full Description', type: 'textarea', required: true, helpText: 'Provide the history and significance of the site.' },
        { name: 'cover_image_url', label: 'Cover Image', type: 'upload', required: true },
        { name: 'gallery_images', label: 'Image Gallery', type: 'upload', helpText: 'Upload additional photos of the site.' },
    ],
  },
  'Gallery': {
    title: 'Create a New Image Gallery',
    opportunityType: 'Gallery',
    submitButtonText: 'Publish Gallery',
    fields: [
        { name: 'title', label: 'Gallery Title', type: 'text', required: true, placeholder: 'e.g., Our Recent Community Project' },
        { name: 'description', label: 'Description (Optional)', type: 'textarea', helpText: 'Provide some context for the images in your gallery.' },
        { name: 'images', label: 'Images', type: 'upload', required: true, helpText: 'Upload all the images for this gallery.' },
    ],
  },
  // Initiatives can remain as is for now, or be expanded like the others.
  'Initiative': {
    title: 'Create a New Initiative',
    opportunityType: 'Initiative',
    submitButtonText: 'Post Initiative',
    fields: [
       { name: 'title', label: 'Initiative Title', type: 'text', required: true },
       { name: 'description', label: 'Initiative Description', type: 'textarea', required: true },
       // You can add more specific fields here later
    ],
  }
};