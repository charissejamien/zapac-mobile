export type EditableProfileField = "name" | "gender";
export type ProfileField = EditableProfileField | "dob";

export type ProfileDetails = {
  name: string;
  email: string;
  gender: string;
  dob: string;
};
