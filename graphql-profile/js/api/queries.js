export const GET_PROFILE = `
  query Me {
    me {
      id
      name
      email
      xp
      projects { id name status }
    }
  }
`;
