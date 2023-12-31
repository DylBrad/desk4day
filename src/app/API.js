const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Map log entries

export async function listLogEntries() {
  const response = await fetch(`${apiUrl}/api/logs`);
  return response.json();
}

export async function createLogEntry(entry) {
  const response = await fetch(`${apiUrl}/api/logs`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}

export async function createLogEntryReview(logId, data) {
  const response = await fetch(`${apiUrl}/api/logReviews/?logId=${logId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getLogEntryReviews(logId) {
  const response = await fetch(`${apiUrl}/api/logReviews/?logId=${logId}`);
  return response.json();
}

export async function getLogEntryImages(logId) {
  const response = await fetch(
    `${apiUrl}/api/logReviews/review-images/?logId=${logId}`,
  );
  return response.json();
}

// User Posts

export async function createUserPost(post) {
  const response = await fetch(`${apiUrl}/api/posts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return response.json();
}

export async function listPosts(filter) {
  const response = await fetch(`${apiUrl}/api/posts`);
  return response.json();
}

export async function createPostComment(postId, data) {
  console.log('API JS: BEFORE', postId, data);
  const response = await fetch(`${apiUrl}/api/postComments/?postId=${postId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  console.log('API JS: AFTER', responseData);
  return responseData;
}

// Get 1 comment to display under newsfeed post
export async function getOneComment(id) {
  const response = await fetch(
    `${apiUrl}/api/postComments/newsfeedPost/?_id=${id}`,
  );
  return response.json();
}

export async function getAllComments(id) {
  const response = await fetch(`${apiUrl}/api/postComments/?_id=${id}`);
  return response.json();
}

export async function listCurrentUserPosts(id) {
  const response = await fetch(
    `${apiUrl}/api/posts/current-users-posts/?_id=${id}`,
  );
  return response.json();
}

export async function updatePost(postId, data) {
  const response = await fetch(`${apiUrl}/api/posts/?_id=${postId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePost(postId) {
  const response = await fetch(`${apiUrl}/api/posts`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      _id: postId,
    }),
  });
  return response.json();
}

// User creation / authentication

export async function createUser(user) {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  console.log('response is', response.json);
  return response.json();
}

export async function loginUser(user) {
  const response = await fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

export async function updateUserProfile(id, data) {
  const response = await fetch(`${apiUrl}/api/users/?_id=${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function findOneUser(id) {
  const response = await fetch(`${apiUrl}/api/users/?_id=${id}`);
  return response.json();
}

export async function findUserByEmail(email) {
  const response = await fetch(`${apiUrl}/api/users/email/?email=${email}`);
  return response.json();
}

export async function findUsersPublicInfo(id) {
  const response = await fetch(`${apiUrl}/api/users/pub/?_id=${id}`);
  return response.json();
}

export async function sendVerificationEmail(id, email) {
  const response = await fetch(
    `${apiUrl}/api/users/send-email/?id=${id}&email=${email}`,
  );
  return response.json();
}
