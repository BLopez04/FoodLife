import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
}

export const getToken = () => {
  return localStorage.getItem("authToken");
}

export function addAuthHeader(otherHeaders = {}) {
  const token = getToken();
  if (!token) {
    return otherHeaders;
  } else {
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`
    };
  }
}