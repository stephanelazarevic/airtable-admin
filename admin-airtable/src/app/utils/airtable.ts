import Airtable from 'airtable';
import { Project, ProjectFormData } from '@/app/types';

const base = new Airtable({ apiKey: 'YOUR_API_KEY' }).base('YOUR_BASE_ID');

export const getProjects = async (): Promise<Project[]> => {
  const records = await base('Projects').select().all();
  return records.map(record => ({
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
    technos: record.fields.Technos,
    link: record.fields.Link,
    visuals: record.fields.Visuals,
    promotion: record.fields.Promotion,
    students: record.fields.Students,
    category: record.fields.Category,
    likes: record.fields.Likes,
  }));
};

export const getProjectById = async (id: string): Promise<Project> => {
  const record = await base('Projects').find(id);
  return {
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
    technos: record.fields.Technos,
    link: record.fields.Link,
    visuals: record.fields.Visuals,
    promotion: record.fields.Promotion,
    students: record.fields.Students,
    category: record.fields.Category,
    likes: record.fields.Likes,
  };
};

export const createProject = async (data: ProjectFormData) => {
  await base('Projects').create([
    {
      fields: {
        Name: data.name,
        Description: data.description,
        Technos: data.technos,
        Link: data.link,
        Visuals: data.visuals,
        Promotion: data.promotion,
        Students: data.students,
        Category: data.category,
        Likes: 0,
      },
    },
  ]);
};

export const updateProject = async (id: string, data: ProjectFormData) => {
  await base('Projects').update([
    {
      id,
      fields: {
        Name: data.name,
        Description: data.description,
        Technos: data.technos,
        Link: data.link,
        Visuals: data.visuals,
        Promotion: data.promotion,
        Students: data.students,
        Category: data.category,
      },
    },
  ]);
};
