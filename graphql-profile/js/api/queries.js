// ===== ENHANCED PROFILE QUERY WITH MORE DATA =====

/**
 * Get complete profile with audit data, skills, and detailed stats
 */
export const GET_ENHANCED_PROFILE = `
  query {
    user {
      id
      login
      attrs
      auditRatio
      totalUp
      totalDown
    }
    
    # Total XP
    transaction_aggregate(where: { type: { _eq: "xp" } }) {
      aggregate {
        sum {
          amount
        }
      }
    }
    
    # XP Transactions (for XP over time chart)
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }
    
    # Projects/Progress
    progress(
      order_by: { createdAt: desc }
    ) {
      id
      grade
      path
      createdAt
      updatedAt
    }
    
    # Results (for more detailed project info)
    result(
      order_by: { createdAt: desc }
      limit: 50
    ) {
      id
      grade
      path
      createdAt
    }
    
    # Audit transactions (audits given)
    audit_given: transaction(
      where: { type: { _eq: "up" } }
      order_by: { createdAt: desc }
    ) {
      id
      amount
      createdAt
      path
    }
    
    # Audit transactions (audits received)
    audit_received: transaction(
      where: { type: { _eq: "down" } }
      order_by: { createdAt: desc }
    ) {
      id
      amount
      createdAt
      path
    }
  }
`;

// ===== SKILLS QUERY =====

/**
 * Get user skills from transactions
 */
export const GET_USER_SKILLS = `
  query {
    transaction(
      where: { 
        type: { _regex: "skill_" }
      }
      order_by: { amount: desc }
    ) {
      type
      amount
      userId
    }
  }
`;

// ===== PISCINE SPECIFIC QUERIES =====

/**
 * Get Piscine statistics (Go or JS)
 */
export const GET_PISCINE_STATS = `
  query {
    # Piscine Go
    piscine_go: progress(
      where: { 
        path: { _ilike: "%piscine-go%" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      grade
      path
      createdAt
    }
    
    # Piscine JS
    piscine_js: progress(
      where: { 
        path: { _ilike: "%piscine-js%" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      grade
      path
      createdAt
    }
  }
`;

// ===== LEVEL/GRADE QUERY =====

/**
 * Get highest level achieved
 */
export const GET_USER_LEVEL = `
  query {
    transaction(
      where: { type: { _eq: "level" } }
      order_by: { amount: desc }
      limit: 1
    ) {
      amount
      createdAt
    }
  }
`;

// ===== DETAILED PROJECT INFO =====

/**
 * Get detailed project information with object names
 */
export const GET_PROJECTS_DETAILED = `
  query {
    progress {
      id
      grade
      path
      createdAt
      object {
        id
        name
        type
      }
    }
  }
`;

// ===== MONTHLY XP STATS =====

/**
 * Get XP grouped by month for trend analysis
 */
export const GET_MONTHLY_XP = `
  query {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
    }
  }
`;

// ===== ATTEMPT STATS (for exercises) =====

/**
 * Get attempt statistics for exercises
 */
export const GET_ATTEMPT_STATS = `
  query {
    result(
      order_by: { createdAt: asc }
    ) {
      objectId
      grade
      path
      createdAt
      object {
        name
        type
      }
    }
  }
`;

// Export all queries
export {
  GET_USER_INFO,
  GET_USER_PROFILE,
  GET_USER_XP,
  GET_TOTAL_XP,
  GET_XP_BY_PROJECT,
  GET_USER_PROGRESS,
  GET_USER_RESULTS,
  GET_AUDIT_RATIO,
  GET_AUDITS,
  GET_OBJECT_INFO,
  GET_ALL_OBJECTS,
  GET_COMPLETE_PROFILE,
  GET_PISCINE_GO_STATS,
  GET_PISCINE_JS_STATS
} from './queries.js';