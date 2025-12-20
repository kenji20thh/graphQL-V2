// ===== MAIN ENHANCED PROFILE QUERY =====
// This is the primary query used in main.js

export const GET_ENHANCED_PROFILE = `
  query {
    user {
      id
      login
      attrs
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
    ) {
      amount
      createdAt
      path
    }
    
    progress(
      order_by: { createdAt: desc }
    ) {
      id
      grade
      path
      createdAt
      updatedAt
    }
    
    audit_up: transaction_aggregate(
      where: { type: { _eq: "up" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    
    audit_down: transaction_aggregate(
      where: { type: { _eq: "down" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

// ===== USER QUERIES =====

export const GET_USER_INFO = `
  query {
    user {
      id
      login
    }
  }
`;

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

// ===== BASIC COMPLETE PROFILE QUERY =====

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