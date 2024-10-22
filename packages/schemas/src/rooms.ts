// We don't add validators here because rooms are created by the server not based on user-provided
// data, so no additional validation is required

export interface NewRoom {
  userIds: [string, string];
  questionId: string;
}

export interface Room extends NewRoom {
  id: string;
  // This one is not serialisable, hence not included in responses. The ydoc is exclusively for use
  // by the Hocuspocus server only.
  // ydoc: Uint8Array | null;
  createdAt: Date;
  updatedAt: Date;
}
