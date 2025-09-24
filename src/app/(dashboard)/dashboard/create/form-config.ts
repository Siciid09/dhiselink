export type FormField = { 
    name: string; 
    label: string; 
    placeholder?: string; 
    type: 'text' | 'textarea' | 'select' | 'date' | 'datetime' | 'upload'; 
    required?: boolean; 
    helpText?: string; 
    options?: { value: string; label: string }[]; 
};

export interface FormConfig { 
    pageTitle: string; 
    pageDescription: string; 
    submitButtonText: string; 
    fields: FormField[]; 
    opportunityType: string; 
    conditionalFields?: { [key: string]: FormField[] }; 
}

export const formConfigs: Record<string, FormConfig> = {
  job: {
    pageTitle: "Post a New Job", 
    pageDescription: "Fill in the details for the new position.", 
    submitButtonText: "Publish Job Posting", 
    opportunityType: "Job",
    fields: [ 
        { name: 'title', label: 'Job Title', type: 'text', required: true }, 
        { name: 'location', label: 'Location', type: 'text', required: true }, 
        { name: 'description', label: 'Job Description', type: 'textarea', required: true }, 
        { name: 'requirements', label: 'Key Requirements', type: 'textarea', helpText: 'Enter each requirement on a new line.' }, 
        { name: 'salary_range', label: 'Compensation / Salary Range', type: 'text' }, 
        { name: 'deadline', label: 'Application Deadline', type: 'date' }, 
    ],
  },
  program: {
    pageTitle: "Add a New Program", 
    pageDescription: "Provide details about an academic program.", 
    submitButtonText: "Add Program", 
    opportunityType: "Program",
    fields: [ 
        { name: 'title', label: 'Program Name', type: 'text', required: true }, 
        { name: 'department', label: 'Department / Faculty', type: 'text', required: true }, 
        { name: 'description', label: 'Program Description', type: 'textarea', required: true }, 
        { name: 'duration', label: 'Program Duration', type: 'text' }, 
        { name: 'eligibility', label: 'Eligibility / Requirements', type: 'textarea', helpText: 'Enter each requirement on a new line.' }, 
        { name: 'deadline', label: 'Application Deadline', type: 'date' }, 
    ],
  },
  service: {
    pageTitle: "Offer a New Service", 
    pageDescription: "Detail a professional service.", 
    submitButtonText: "Publish Service", 
    opportunityType: "Service",
    fields: [ 
        { name: 'title', label: 'Service Name', type: 'text', required: true }, 
        { name: 'description', label: 'Service Description', type: 'textarea', required: true } 
    ],
  },
  idea: {
      pageTitle: "Submit a New Idea", 
      pageDescription: "Share an idea with the community.", 
      submitButtonText: "Submit Idea", 
      opportunityType: "Idea",
      fields: [ 
          { name: 'title', label: 'Idea Title', type: 'text', required: true }, 
          { name: 'summary', label: 'Summary', type: 'textarea', required: true } 
      ],
  },
  initiative: {
    pageTitle: "Post a New Initiative", 
    pageDescription: "Select the type of initiative you want to post and fill in the details.", 
    submitButtonText: "Publish Initiative", 
    opportunityType: "Initiative",
    fields: [
      { 
        name: 'type', 
        label: 'Posting Type', 
        type: 'select', 
        required: true, 
        options: [ 
            { value: 'Project', label: 'Project' }, 
            { value: 'Event', label: 'Event' }, 
            { value: 'Grant', label: 'Grant' }, 
            { value: 'Tender', label: 'Tender' }, 
            { value: 'Announcement', label: 'Announcement' }, 
        ] 
      },
    ],
    conditionalFields: {
      Project: [ 
          { name: 'title', label: 'Project Title', type: 'text', required: true }, 
          { name: 'description', label: 'Project Description', type: 'textarea', required: true }, 
          { name: 'budget_range', label: 'Budget Range', type: 'text' }, 
          { name: 'requirements', label: 'Requirements', type: 'textarea', helpText: 'Enter each on a new line.'}, 
          { name: 'end_date', label: 'Submission Deadline', type: 'date', required: true }, 
      ],
      Event: [ 
          { name: 'title', label: 'Event Title', type: 'text', required: true }, 
          { name: 'event_type', label: 'Event Type', type: 'select', required: true, options: [{value: 'Conference', label: 'Conference'}, {value: 'Workshop', label: 'Workshop'}] }, 
          { name: 'description', label: 'Event Description', type: 'textarea', required: true }, 
          { name: 'event_datetime', label: 'Event Date & Time', type: 'datetime', required: true }, 
          { name: 'venue', label: 'Location / Venue', type: 'text', required: true }, 
          { name: 'end_date', label: 'Registration Deadline', type: 'date' }, 
      ],
      Grant: [ 
          { name: 'title', label: 'Grant Title', type: 'text', required: true }, 
          { name: 'description', label: 'Grant Description', type: 'textarea', required: true }, 
          { name: 'funding_amount', label: 'Funding Amount', type: 'text' }, 
          { name: 'requirements', label: 'Eligibility Criteria', type: 'textarea', helpText: 'Enter each on a new line.' }, 
          { name: 'end_date', label: 'Application Deadline', type: 'date', required: true }, 
          { name: 'attachments', label: 'Supporting Documents', type: 'upload' }, 
      ],
      Tender: [ 
          { name: 'title', label: 'Tender Title', type: 'text', required: true }, 
          { name: 'description', label: 'Scope of Work', type: 'textarea', required: true }, 
          { name: 'budget_range', label: 'Budget Range', type: 'text' }, 
          { name: 'requirements', label: 'Eligibility', type: 'textarea', helpText: 'Enter each on a new line.' }, 
          { name: 'end_date', label: 'Submission Deadline', type: 'date', required: true }, 
          { name: 'attachments', label: 'Supporting Documents', type: 'upload' }, 
      ],
      Announcement: [ 
          { name: 'title', label: 'Announcement Title', type: 'text', required: true }, 
          { name: 'announcement_type', label: 'Announcement Type', type: 'select', required: true, options: [{value: 'General Notice', label: 'General Notice'}, {value: 'Policy Update', label: 'Policy Update'}] }, 
          { name: 'description', label: 'Announcement Details', type: 'textarea', required: true }, 
          { name: 'end_date', label: 'Effective Date / Deadline', type: 'date' }, 
          { name: 'attachments', label: 'Attachments', type: 'upload' }, 
      ]
    }
  }
};