export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'datetime';
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
    conditionalFields?: { [key: string]: FormField[] };
}

export const formConfigurations: Record<string, FormConfig> = {
    'Job': {
        title: 'Create a New Job Posting',
        opportunityType: 'Job',
        submitButtonText: 'Post Job',
        fields: [
            { name: 'title', label: 'Job Title', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'description', label: 'Full Job Description', type: 'textarea', required: true },
        ],
    },
    'Service': {
        title: 'Offer a New Service',
        opportunityType: 'Service',
        submitButtonText: 'Publish Service',
        fields: [
             { name: 'title', label: 'Service Title', type: 'text', required: true },
             { name: 'description', label: 'Service Description', type: 'textarea', required: true },
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
        ]
    },
    'Initiative': {
        title: 'Create a New Initiative',
        opportunityType: 'Initiative',
        submitButtonText: 'Post Initiative',
        fields: [
            { 
                name: 'type', 
                label: 'Type of Initiative', 
                type: 'select', 
                required: true, 
                options: [
                    { value: '', label: 'Select a Type...' }, { value: 'Project', label: 'Project' }, 
                    { value: 'Event', label: 'Event' }, { value: 'Tender', label: 'Tender' }, 
                    { value: 'Grant', label: 'Grant' }, { value: 'Announcement', label: 'Announcement' }
                ]
            },
        ],
        conditionalFields: {
            Project: [ 
                { name: 'title', label: 'Project Title', type: 'text', required: true }, 
                { name: 'description', label: 'Project Description', type: 'textarea', required: true }, 
                { name: 'end_date', label: 'Submission Deadline', type: 'date' }, 
            ],
            Event: [ 
                { name: 'title', label: 'Event Title', type: 'text', required: true }, 
                { name: 'description', label: 'Event Description', type: 'textarea', required: true }, 
                { name: 'event_datetime', label: 'Event Date & Time', type: 'datetime', required: true }, 
                { name: 'venue', label: 'Location / Venue', type: 'text', required: true }, 
            ],
            Tender: [ 
                { name: 'title', label: 'Tender Title', type: 'text', required: true }, 
                { name: 'description', label: 'Scope of Work', type: 'textarea', required: true }, 
                { name: 'end_date', label: 'Submission Deadline', type: 'date', required: true }, 
            ],
            Grant: [ 
                { name: 'title', label: 'Grant Title', type: 'text', required: true }, 
                { name: 'description', label: 'Grant Description', type: 'textarea', required: true }, 
                { name: 'funding_amount', label: 'Funding Amount', type: 'text' }, 
                { name: 'end_date', label: 'Application Deadline', type: 'date', required: true }, 
            ],
            Announcement: [ 
                { name: 'title', label: 'Announcement Title', type: 'text', required: true }, 
                { name: 'description', label: 'Announcement Details', type: 'textarea', required: true }, 
            ]
        }
    }
};