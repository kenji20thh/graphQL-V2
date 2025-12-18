// ===== USER QUERIES =====

/**
 * Get basic user information
 */
export const GET_USER_INFO = `
  query {
    user {
      id
      login
    }
  }
`;

/**
 * Get user with first name and last name if available
 */
export const GET_USER_PROFILE = `
  query {
    user {
      id
      login
      attrs
    }
  }
`;

// ===== XP QUERIES =====

/**
 * Get all XP transactions for the user
 */
export const GET_USER_XP = `
  query {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      id
      type
      amount
      objectId
      createdAt
      path
    }
  }
`;

/**
 * Get total XP amount
 */
export const GET_TOTAL_XP = `
  query {
    transaction_aggregate(
      where: { type: { _eq: "xp" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

/**
 * Get XP grouped by project (path)
 */
export const GET_XP_BY_PROJECT = `
  query {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { amount: desc }
    ) {
      amount
      path
      createdAt
    }
  }
`;

// ===== PROGRESS & RESULTS QUERIES =====

/**
 * Get user progress (projects/exercises)
 */
export const GET_USER_PROGRESS = `
  query {
    progress(
      order_by: { createdAt: desc }
    ) {
      id
      grade
      path
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get results (pass/fail for projects)
 */
export const GET_USER_RESULTS = `
  query {
    result(
      order_by: { createdAt: desc }
    ) {
      id
      grade
      type
      path
      createdAt
    }
  }
`;

// ===== AUDIT QUERIES =====

/**
 * Get audit ratio (audits done vs audits received)
 */
export const GET_AUDIT_RATIO = `
  query {
    user {
      id
      login
      auditRatio
      totalUp
      totalDown
    }
  }
`;

/**
 * Get audit transactions
 */
export const GET_AUDITS = `
  query {
    transaction(
      where: { type: { _eq: "up" } }
    ) {
      id
      type
      amount
      createdAt
      path
    }
  }
`;

// ===== OBJECT/PROJECT QUERIES =====

/**
 * Get information about a specific object (project/exercise)
 */
export const GET_OBJECT_INFO = `
  query GetObject($objectId: Int!) {
    object(where: { id: { _eq: $objectId } }) {
      id
      name
      type
      attrs
    }
  }
`;

/**
 * Get all projects
 */
export const GET_ALL_OBJECTS = `
  query {
    object(
      where: { type: { _eq: "project" } }
    ) {
      id
      name
      type
    }
  }
`;

// ===== COMBINED QUERY FOR PROFILE =====

/**
 * Get complete profile data in one query
 * This is the main query you should use for the profile page
 */
export const GET_COMPLETE_PROFILE = `
  query {
    user {
      id
      login
    }
    transaction_aggregate(where: { type: { _eq: "xp" } }) {
      aggregate {
        sum {
          amount
        }
      }
    }
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
      limit: 50
    ) {
      amount
      createdAt
      path
    }
    progress(order_by: { createdAt: desc }, limit: 20) {
      grade
      path
      createdAt
    }
  }
`;

// ===== PISCINE STATS QUERIES =====

/**
 * Get Piscine Go stats
 */
export const GET_PISCINE_GO_STATS = `
  query {
    progress(
      where: { path: { _like: "%piscine-go%" } }
      order_by: { createdAt: asc }
    ) {
      id
      grade
      path
      createdAt
    }
  }
`;

/**
 * Get Piscine JS stats
 */
export const GET_PISCINE_JS_STATS = `
  query {
    progress(
      where: { path: { _like: "%piscine-js%" } }
      order_by: { createdAt: asc }
    ) {
      id
      grade
      path
      createdAt
    }
  }
`;