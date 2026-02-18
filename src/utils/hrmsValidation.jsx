// validationUtils.jsx

/**
 * Comprehensive Validation Utility for Employee Management System
 * Contains validation functions for all fields with proper error messages
 * Updated to fix all bugs from VBZ_HRMS bug tracking
 */

import { useState } from "react";

// ==================== LOGIN PAGE VALIDATIONS ====================

// Email validation
// Email validation - FIXED to block emails longer than 30 characters
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || email.trim() === '') {
    return { isValid: false, errors: ['Email is required'] };
  }
  
  const trimmedEmail = email.trim();
  
  // Length validation - BLOCK if more than 30 characters
  if (trimmedEmail.length < 6) {
    errors.push('Email must be at least 6 characters long');
  }
  
  if (trimmedEmail.length > 30) {
    errors.push('Email must not exceed 30 characters');
    // Return immediately with errors - BLOCK FURTHER VALIDATION
    return {
      isValid: false,
      errors
    };
  }
  
  // Character validation (a-z, A-Z, 0-9, @ . _)
  const emailRegex = /^[a-zA-Z0-9@._]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Email can only contain letters, numbers, @, ., and _');
  }
  
  // Format validation (example@domain.com)
  const formatRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  if (!formatRegex.test(trimmedEmail)) {
    errors.push('Email must follow format: example@domain.com');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation - FIXES BUGS: VBZ_HRMS_BUG_004, VBZ_HRMS_BUG_005
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.trim() === '') {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  // Length validation - FIX for BUG_004 and BUG_005
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password.length > 20) {
    errors.push('Password must not exceed 20 characters');
  }
  
  // Character validation (A-Z, a-z, 0-9, special characters)
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  if (!passwordRegex.test(password)) {
    errors.push('Password contains invalid characters');
  }
  
  // Complexity requirements
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Employee ID validation - FIXES BUGS: VBZ_HRMS_BUG_002, VBZ_HRMS_BUG_003
export const validateEmployeeId = (empId) => {
  const errors = [];
  
  if (!empId || empId.trim() === '') {
    return { isValid: false, errors: ['Employee ID is required'] };
  }
  
  // Length validation - FIX for BUG_002 (max 20 chars)
  if (empId.length < 4) {
    errors.push('Employee ID must be at least 4 characters long');
  }
  if (empId.length > 20) {
    errors.push('Employee ID must not exceed 20 characters');
  }
  
  // Check for special characters - FIX for BUG_003
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(empId)) {
    errors.push('Employee ID cannot contain special characters');
  }
  
  // Should start with VPPL followed by numbers (based on requirement)
  const empIdRegex = /^VPPL[0-9]+$/;
  if (!empIdRegex.test(empId)) {
    errors.push('Employee ID must start with VPPL followed by numbers only (Ex: VPPL001)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.trim() === '') {
    return { isValid: false, errors: ['Username is required'] };
  }
  
  // Length validation
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  if (username.length > 30) {
    errors.push('Username must not exceed 30 characters');
  }
  
  // Character validation (a-z, A-Z, 0-9, _)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscore');
  }
  
  // No spaces allowed
  if (/\s/.test(username)) {
    errors.push('Username cannot contain spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== EMPLOYEE MANAGEMENT VALIDATIONS ====================

// Name validation (First, Middle, Last) - FIXES BUGS: VBZ_HRMS_BUG_015, VBZ_HRMS_BUG_016, VBZ_HRMS_BUG_017
export const validateName = (name, fieldName, isRequired = true) => {
  const errors = [];
  
  // Check if empty
  if (!name || name.trim() === '') {
    if (isRequired) {
      errors.push(`${fieldName} is required`);
    }
    return {
      isValid: !isRequired || errors.length === 0,
      errors
    };
  }
  
  // Length validation - FIX for BUG_015 (max 50 chars)
  if (name.length < 1 && isRequired) {
    errors.push(`${fieldName} must be at least 2 characters long`); // FIX for BUG_017
  }
  if (name.length > 50) {
    errors.push(`${fieldName} must not exceed 50 characters`); // FIX for BUG_015
  }
  
  // Check for numbers - FIX for BUG_016
  if (/[0-9]/.test(name)) {
    errors.push(`${fieldName} cannot contain numbers`);
  }
  
  // Check for special characters - FIX for BUG_016
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(name)) {
    errors.push(`${fieldName} cannot contain special characters`);
  }
  
  // Alphabets only
  if (!/^[A-Za-z\s]+$/.test(name)) {
    errors.push(`${fieldName} can only contain alphabets`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Department validation
export const validateDepartment = (department, departmentMaster = []) => {
  const errors = [];
  
  if (!department || department.trim() === '') {
    return { isValid: false, errors: ['Department is required'] };
  }
  
  // Length validation
  if (department.length < 2) {
    errors.push('Department must be at least 2 characters long');
  }
  if (department.length > 50) {
    errors.push('Department must not exceed 50 characters');
  }
  
  // Character validation (Alphabets, spaces)
  if (!/^[A-Za-z\s]+$/.test(department)) {
    errors.push('Department can only contain alphabets and spaces');
  }
  
  // Master validation
  if (departmentMaster.length > 0 && !departmentMaster.includes(department)) {
    errors.push('Department must match department master list');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Designation validation
export const validateDesignation = (designation, designationMaster = []) => {
  const errors = [];
  
  if (!designation || designation.trim() === '') {
    return { isValid: false, errors: ['Designation is required'] };
  }
  
  // Length validation
  if (designation.length < 2) {
    errors.push('Designation must be at least 2 characters long');
  }
  if (designation.length > 50) {
    errors.push('Designation must not exceed 50 characters');
  }
  
  // Character validation (Alphabets, spaces)
  if (!/^[A-Za-z\s]+$/.test(designation)) {
    errors.push('Designation can only contain alphabets and spaces');
  }
  
  // Master validation
  if (designationMaster.length > 0 && !designationMaster.includes(designation)) {
    errors.push('Designation must match designation master list');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Date of Birth validation - FIXES BUG: VBZ_HRMS_BUG_022
export const validateDateOfBirth = (dob) => {
  const errors = [];
  
  if (!dob || dob.trim() === '') {
    return { isValid: false, errors: ['Date of Birth is required'] };
  }
  
 
  
  // Age validation (≥ 18 years) - FIX for BUG_022
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) {
    errors.push('Employee must be at least 18 years old');
  }
  
  // Check if date is not in future
  if (birthDate > today) {
    errors.push('Date of Birth cannot be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// PAN Number validation
export const validatePAN = (pan) => {
  const errors = [];

  if (!pan || pan.trim() === '') {
    return { isValid: false, errors: ['PAN Number is required'], value: '' };
  }

  // 🔴 uppercase + remove invalid chars
  let clean = pan.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // 🔴 limit 10 chars
  if (clean.length > 10) {
    clean = clean.slice(0, 10);
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(clean)) {
    errors.push('PAN must follow format: AAAAA9999A');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: clean
  };
};
// Aadhaar Number validation - FIXES BUG: VBZ_HRMS_BUG_023
export const validateAadhaar = (aadhaar) => {
  const errors = [];

  if (!aadhaar || aadhaar.trim() === '') {
    return { isValid: false, errors: ['Aadhaar Number is required'], value: '' };
  }

  // 🔴 REMOVE NON-DIGITS
  let clean = aadhaar.replace(/\D/g, '');

  // 🔴 LIMIT TO 12 DIGITS
  if (clean.length > 12) {
    clean = clean.slice(0, 12);
  }

  // VALIDATION
  if (clean.length !== 12) {
    errors.push('Aadhaar Number must be exactly 12 digits');
  }

  if (clean.startsWith('0') || clean.startsWith('1')) {
    errors.push('Aadhaar Number cannot start with 0 or 1');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: clean   // 🔥 IMPORTANT (sanitized value returned)
  };
};

// Phone Number validation - FIXES BUGS: VBZ_HRMS_BUG_025, VBZ_HRMS_BUG_026
export const validatePhoneNumber = (phone) => {
  const errors = [];
  
  if (!phone || phone.trim() === '') {
    return { isValid: false, errors: ['Phone Number is required'] };
  }
  
  // Remove any spaces
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Length validation
  if (cleanPhone.length !== 10) {
    errors.push('Phone Number must be exactly 10 digits');
  }
  
  // Numbers only - FIX for BUG_025
  if (!/^\d+$/.test(cleanPhone)) {
    errors.push('Phone Number can only contain numbers');
  }
  
  // Must start with 6/7/8/9 - FIX for BUG_026
  if (!/^[6-9]/.test(cleanPhone)) {
    errors.push('Phone Number must start with 6, 7, 8, or 9');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Address validation - FIXES BUG: VBZ_HRMS_BUG_030
export const validateAddress = (address) => {
  const errors = [];
  
  if (!address || address.trim() === '') {
    return { isValid: false, errors: ['Address is required'] };
  }
  
  // Length validation - FIX for BUG_030
  if (address.length < 10) {
    errors.push('Address must be at least 10 characters long');
  }
  if (address.length > 250) {
    errors.push('Address must not exceed 250 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Emergency Contact Name validation - FIXES BUGS: VBZ_HRMS_BUG_031, VBZ_HRMS_BUG_032, VBZ_HRMS_BUG_033
export const validateEmergencyContact = (name) => {
  const errors = [];
  
  if (!name || name.trim() === '') {
    return { isValid: false, errors: ['Emergency Contact Name is required'] };
  }
  
  // Length validation - FIX for BUG_031
  if (name.length < 2) {
    errors.push('Emergency Contact Name must be at least 2 characters long'); // FIX for BUG_033
  }
  if (name.length > 50) {
    errors.push('Emergency Contact Name must not exceed 50 characters'); // FIX for BUG_031
  }
  
  // Check for numbers - FIX for BUG_032
  if (/[0-9]/.test(name)) {
    errors.push('Emergency Contact Name cannot contain numbers');
  }
  
  // Check for special characters - FIX for BUG_032
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(name)) {
    errors.push('Emergency Contact Name cannot contain special characters');
  }
  
  // Alphabets only
  if (!/^[A-Za-z\s]+$/.test(name)) {
    errors.push('Emergency Contact Name can only contain alphabets and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Emergency Phone Number validation - FIXES BUGS: VBZ_HRMS_BUG_034, VBZ_HRMS_BUG_035
export const validateEmergencyPhone = (phone) => {
  const errors = [];
  
  if (!phone || phone.trim() === '') {
    return { isValid: false, errors: ['Emergency Phone Number is required'] };
  }
  
  // Remove any spaces
  const cleanPhone = phone.replace(/\s/g, '');
  
   if (!/^\d{10}$/.test(value))
    return "Emergency Phone Number must be exactly 10 digits";

  
  // Numbers only - FIX for BUG_034
  if (!/^\d+$/.test(cleanPhone)) {
    errors.push('Emergency Phone Number can only contain numbers');
  }
  
  // Must start with 6/7/8/9 - FIX for BUG_035
  if (!/^[6-9]/.test(cleanPhone)) {
    errors.push('Emergency Phone Number must start with 6, 7, 8, or 9');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Date of Joining validation - FIXES BUG: VBZ_HRMS_BUG_036
export const validateDateOfJoining = (doj) => {
  const errors = [];
  
  if (!doj || doj.trim() === '') {
    return { isValid: false, errors: ['Date of Joining is required'] };
  }
  
  // Check if it's a valid date
  const date = new Date(doj);
  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
    return { isValid: false, errors };
  }
  
  // Check if date is not in future - FIX for BUG_036
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date > today) {
    errors.push('Date of Joining cannot be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Work Location validation
export const validateWorkLocation = (location, locationMaster = []) => {
  const errors = [];
  
  if (!location || location.trim() === '') {
    return { isValid: false, errors: ['Work Location is required'] };
  }
  
  // Length validation
  if (location.length < 2) {
    errors.push('Work Location must be at least 2 characters long');
  }
  if (location.length > 50) {
    errors.push('Work Location must not exceed 50 characters');
  }
  
  // Master validation
  if (locationMaster.length > 0 && !locationMaster.includes(location)) {
    errors.push('Work Location must match company locations');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== BANK DETAILS VALIDATIONS ====================

// Bank Name validation - FIXES BUGS: VBZ_HRMS_BUG_037, VBZ_HRMS_BUG_038, VBZ_HRMS_BUG_039
export const validateBankName = (bankName, bankMaster = []) => {
  const errors = [];
  
  if (!bankName || bankName.trim() === '') {
    return { isValid: false, errors: ['Bank Name is required'] };
  }
  
  // Length validation - FIX for BUG_037
  if (bankName.length < 2) {
    errors.push('Bank Name must be at least 2 characters long'); // FIX for BUG_039
  }
  if (bankName.length > 50) {
    errors.push('Bank Name must not exceed 50 characters'); // FIX for BUG_037
  }
  
  // Check for numbers - FIX for BUG_038
  if (/[0-9]/.test(bankName)) {
    errors.push('Bank Name cannot contain numbers');
  }
  
  // Check for special characters - FIX for BUG_038
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(bankName)) {
    errors.push('Bank Name cannot contain special characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(bankName)) {
    errors.push('Bank Name can only contain alphabets and spaces');
  }
  
  // Master validation
  if (bankMaster.length > 0 && !bankMaster.includes(bankName)) {
    errors.push('Bank Name must match bank master list');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Account Number validation - FIXES BUGS: VBZ_HRMS_BUG_040, VBZ_HRMS_BUG_041
export const validateAccountNumber = (accountNo) => {
  const errors = [];
  
  if (!accountNo || accountNo.trim() === '') {
    return { isValid: false, errors: ['Account Number is required'] };
  }
  
  // Remove any spaces
  const cleanAccount = accountNo.replace(/\s/g, '');
  
  // Length validation
  if (cleanAccount.length < 9) {
    errors.push('Account Number must be at least 9 digits long');
  }
  if (cleanAccount.length > 18) {
    errors.push('Account Number must not exceed 18 digits');
  }
  
  // Numbers only, no spaces
  if (!/^\d+$/.test(cleanAccount)) {
    errors.push('Account Number can only contain numbers');
  }
  
  // Check for repeating digits - FIX for BUG_040
  if (/^(\d)\1+$/.test(cleanAccount)) {
    errors.push('Account Number cannot contain all repeating digits');
  }
  
  // Check for all zeros - FIX for BUG_041
  if (/^0+$/.test(cleanAccount)) {
    errors.push('Account Number cannot be all zeros');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// IFSC Code validation - FIXES BUG: VBZ_HRMS_BUG_042
export const validateIFSC = (ifsc) => {
  const errors = [];
  
  if (!ifsc || ifsc.trim() === '') {
    return { isValid: false, errors: ['IFSC Code is required'] };
  }
  
  // Convert to uppercase for validation
  const cleanIFSC = ifsc.toUpperCase().trim();
  
  // Length validation
  if (cleanIFSC.length !== 11) {
    errors.push('IFSC Code must be exactly 11 characters');
  }
  
  // Format: 4 letters + 0 + 6 digits/alphanumeric - FIX for BUG_042
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(cleanIFSC)) {
    errors.push('IFSC must follow format: 4 letters + 0 + 6 alphanumeric characters (e.g., SBIN0001234)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Branch Name validation
export const validateBranchName = (branchName) => {
  const errors = [];
  
  if (!branchName || branchName.trim() === '') {
    return { isValid: false, errors: ['Branch Name is required'] };
  }
  
  // Length validation
  if (branchName.length < 2) {
    errors.push('Branch Name must be at least 2 characters long');
  }
  if (branchName.length > 30) {
    errors.push('Branch Name must not exceed 30 characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(branchName)) {
    errors.push('Branch Name can only contain alphabets and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Beneficiary Name validation
export const validateBeneficiaryName = (beneficiaryName) => {
  const errors = [];
  
  if (!beneficiaryName || beneficiaryName.trim() === '') {
    return { isValid: false, errors: ['Beneficiary Name is required'] };
  }
  
  // Length validation
  if (beneficiaryName.length < 2) {
    errors.push('Beneficiary Name must be at least 2 characters long');
  }
  if (beneficiaryName.length > 50) {
    errors.push('Beneficiary Name must not exceed 50 characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(beneficiaryName)) {
    errors.push('Beneficiary Name can only contain alphabets and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== SALARY & STATUTORY VALIDATIONS ====================

// CTC validation - FIXES BUGS: VBZ_HRMS_BUG_057, VBZ_HRMS_BUG_058, VBZ_HRMS_BUG_059, VBZ_HRMS_BUG_060
export const validateCTC = (ctc) => {
  const errors = [];
  
  if (!ctc || ctc.toString().trim() === '') {
    return { isValid: false, errors: ['CTC is required'] };
  }
  
  const ctcStr = ctc.toString().trim();
  
  // Length validation - FIX for BUG_057
  if (ctcStr.length > 10) {
    errors.push('CTC must not exceed 10 digits');
  }
  
  // Remove leading zeros for validation - FIX for BUG_060
  const ctcWithoutLeadingZeros = ctcStr.replace(/^0+/, '');
  
  // Check if it's a valid number
  const ctcNum = parseFloat(ctcWithoutLeadingZeros);
  if (isNaN(ctcNum)) {
    errors.push('CTC must be a number');
  } else {
    // Check for all zeros - FIX for BUG_058
    if (ctcNum === 0) {
      errors.push('CTC must be greater than 0');
    }
    
    // Check for negative value - FIX for BUG_059
    if (ctcNum < 0) {
      errors.push('CTC cannot be negative');
    }
    
    // Check for leading zeros - FIX for BUG_060
    if (ctcStr.length > 1 && ctcStr.startsWith('0') && ctcNum > 0) {
      errors.push('CTC cannot start with zeros');
    }
  }
  
  // Decimal validation
  if (!/^\d+(\.\d{1,2})?$/.test(ctcStr)) {
    errors.push('CTC can only contain numbers and up to 2 decimal places');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// PF UAN validation - FIXES BUGS: VBZ_HRMS_BUG_043, VBZ_HRMS_BUG_044, VBZ_HRMS_BUG_045, VBZ_HRMS_BUG_046, VBZ_HRMS_BUG_047
export const validatePFUAN = (pfuan) => {
  const errors = [];
  
  if (!pfuan || pfuan.trim() === '') {
    return { isValid: false, errors: ['PF UAN is required'] };
  }
  
  // Trim and check for leading/trailing spaces - FIX for BUG_043
  const cleanPFUAN = pfuan.trim();
  
  // Check if original had leading spaces
  if (pfuan.length !== cleanPFUAN.length) {
    errors.push('PF UAN cannot have leading or trailing spaces');
  }
  
  // Length validation - FIX for BUG_045
  if (cleanPFUAN.length !== 12) {
    errors.push('PF UAN must be exactly 12 digits');
  }
  
  // Numbers only - FIX for BUG_044
  if (!/^\d+$/.test(cleanPFUAN)) {
    errors.push('PF UAN can only contain numbers');
  }
  
  // Check for repeating digits - FIX for BUG_046
  if (/^(\d)\1+$/.test(cleanPFUAN)) {
    errors.push('PF UAN cannot contain all repeating digits');
  }
  
  // Check for all zeros - FIX for BUG_047
  if (/^0+$/.test(cleanPFUAN)) {
    errors.push('PF UAN cannot be all zeros');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ESI Number validation - FIXES BUGS: VBZ_HRMS_BUG_049, VBZ_HRMS_BUG_050, VBZ_HRMS_BUG_051, VBZ_HRMS_BUG_052, VBZ_HRMS_BUG_053
export const validateESINumber = (esiNumber, isRequired = false) => {
  const errors = [];
  
  if (!esiNumber || esiNumber.trim() === '') {
    if (isRequired) {
      errors.push('ESI Number is required');
    }
    return {
      isValid: !isRequired || errors.length === 0,
      errors
    };
  }
  
  // Trim and check for leading/trailing spaces - FIX for BUG_049
  const cleanESI = esiNumber.trim();
  
  // Check if original had leading spaces
  if (esiNumber.length !== cleanESI.length) {
    errors.push('ESI Number cannot have leading or trailing spaces');
  }
  
  // Length validation - FIX for BUG_051
  if (cleanESI.length !== 10) {
    errors.push('ESI Number must be exactly 10 digits');
  }
  
  // Numbers only - FIX for BUG_050
  if (!/^\d+$/.test(cleanESI)) {
    errors.push('ESI Number can only contain numbers');
  }
  
  // Check for repeating digits - FIX for BUG_052
  if (/^(\d)\1+$/.test(cleanESI)) {
    errors.push('ESI Number cannot contain all repeating digits');
  }
  
  // Check for all zeros - FIX for BUG_053
  if (/^0+$/.test(cleanESI)) {
    errors.push('ESI Number cannot be all zeros');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Medical Insurance Number validation - FIXES BUG: VBZ_HRMS_BUG_056
export const validateMedicalInsurance = (insuranceNumber) => {
  const errors = [];
  
  if (!insuranceNumber || insuranceNumber.trim() === '') {
    return {
      isValid: true,
      errors: []
    };
  }
  
  // Length validation
  if (insuranceNumber.length < 5) {
    errors.push('Medical Insurance Number must be at least 5 characters long');
  }
  if (insuranceNumber.length > 30) {
    errors.push('Medical Insurance Number must not exceed 30 characters');
  }
  
  // Check for special characters - FIX for BUG_056
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(insuranceNumber)) {
    errors.push('Medical Insurance Number cannot contain special characters');
  }
  
  // Alphanumeric
  if (!/^[A-Za-z0-9]+$/.test(insuranceNumber)) {
    errors.push('Medical Insurance Number can only contain letters and numbers');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== FILE VALIDATIONS ====================

// File validation
export const validateFile = (file, fieldName, allowedTypes = [], maxSize = null, isRequired = true) => {
  const errors = [];
  
  if (!file) {
    if (isRequired) {
      errors.push(`${fieldName} is required`);
    }
    return {
      isValid: !isRequired || errors.length === 0,
      errors
    };
  }
  
  // File type validation
  if (allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      errors.push(`${fieldName} must be of type: ${allowedTypes.join(', ')}`);
    }
  }
  
  // File size validation
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    errors.push(`${fieldName} must not exceed ${maxSizeMB}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== DEPARTMENT MANAGEMENT VALIDATIONS ====================

// Department Name validation for Department Management - FIXES BUGS: VBZ_HRMS_BUG_061, VBZ_HRMS_BUG_062, VBZ_HRMS_BUG_063
export const validateDepartmentName = (departmentName) => {
  const errors = [];
  
  if (!departmentName || departmentName.trim() === '') {
    return { isValid: false, errors: ['Department name is required'] };
  }
  
  // Length validation - FIX for BUG_061
  if (departmentName.length < 2) {
    errors.push('Department name must be at least 2 characters long'); // FIX for BUG_063
  }
  if (departmentName.length > 50) {
    errors.push('Department name must not exceed 50 characters'); // FIX for BUG_061
  }
  
  // Check for numbers - FIX for BUG_062
  if (/[0-9]/.test(departmentName)) {
    errors.push('Department name cannot contain numbers');
  }
  
  // Check for special characters - FIX for BUG_062
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(departmentName)) {
    errors.push('Department name cannot contain special characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(departmentName)) {
    errors.push('Department name can only contain alphabets and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Designation Name validation for Department Management - FIXES BUGS: VBZ_HRMS_BUG_064, VBZ_HRMS_BUG_065, VBZ_HRMS_BUG_066
export const validateDesignationName = (designationName) => {
  const errors = [];
  
  if (!designationName || designationName.trim() === '') {
    return { isValid: false, errors: ['Designation name is required'] };
  }
  
  // Length validation - FIX for BUG_064
  if (designationName.length < 2) {
    errors.push('Designation name must be at least 2 characters long'); // FIX for BUG_066
  }
  if (designationName.length > 50) {
    errors.push('Designation name must not exceed 50 characters'); // FIX for BUG_064
  }
  
  // Check for numbers - FIX for BUG_065
  if (/[0-9]/.test(designationName)) {
    errors.push('Designation name cannot contain numbers');
  }
  
  // Check for special characters - FIX for BUG_065
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(designationName)) {
    errors.push('Designation name cannot contain special characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(designationName)) {
    errors.push('Designation name can only contain alphabets and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== LEAVE MANAGEMENT VALIDATIONS ====================

// Leave Type Name validation
export const validateLeaveType = (leaveType, leaveMaster = []) => {
  const errors = [];
  
  if (!leaveType || leaveType.trim() === '') {
    return { isValid: false, errors: ['Leave Type Name is required'] };
  }
  
  // Length validation
  if (leaveType.length < 2) {
    errors.push('Leave Type Name must be at least 2 characters long');
  }
  if (leaveType.length > 50) {
    errors.push('Leave Type Name must not exceed 50 characters');
  }
  
  // Alphabets only
  if (!/^[A-Za-z\s]+$/.test(leaveType)) {
    errors.push('Leave Type Name can only contain alphabets');
  }
  
  // Master validation
  if (leaveMaster.length > 0 && !leaveMaster.includes(leaveType)) {
    errors.push('Leave Type Name must match leave master list');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Number of Days Leave validation
export const validateNoOfDaysLeave = (days) => {
  const errors = [];
  
  if (!days || days.toString().trim() === '') {
    return { isValid: false, errors: ['Number of Days Leave is required'] };
  }
  
  const daysStr = days.toString();
  
  // Length validation
  if (daysStr.length < 1 || daysStr.length > 3) {
    errors.push('Number of Days Leave must be between 1 and 3 digits');
  }
  
  // Numbers only
  if (!/^\d+$/.test(daysStr)) {
    errors.push('Number of Days Leave can only contain numbers');
  }
  
  // Value > 0
  const daysNum = parseInt(days, 10);
  if (daysNum <= 0) {
    errors.push('Number of Days Leave must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Holiday Name validation
export const validateHolidayName = (holidayName, holidayMaster = []) => {
  const errors = [];
  
  if (!holidayName || holidayName.trim() === '') {
    return { isValid: false, errors: ['Holiday Name is required'] };
  }
  
  // Length validation
  if (holidayName.length < 2) {
    errors.push('Holiday Name must be at least 2 characters long');
  }
  if (holidayName.length > 50) {
    errors.push('Holiday Name must not exceed 50 characters');
  }
  
  // Alphabets and spaces only
  if (!/^[A-Za-z\s]+$/.test(holidayName)) {
    errors.push('Holiday Name can only contain alphabets and spaces');
  }
  
  // Master validation
  if (holidayMaster.length > 0 && !holidayMaster.includes(holidayName)) {
    errors.push('Holiday Name must match holiday master list');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Percentage validation (for Salary Basic %, HRA %, PF %)
export const validatePercentage = (percentage, fieldName) => {
  const errors = [];
  
  if (!percentage || percentage.toString().trim() === '') {
    return { isValid: false, errors: [`${fieldName} is required`] };
  }
  
  const percentStr = percentage.toString();
  
  // Length validation
  if (percentStr.length < 1 || percentStr.length > 3) {
    errors.push(`${fieldName} must be between 1 and 3 digits`);
  }
  
  // Numbers only
  if (!/^\d+$/.test(percentStr)) {
    errors.push(`${fieldName} can only contain numbers`);
  }
  
  // Between 0–100
  const percentNum = parseInt(percentage, 10);
  if (percentNum < 0 || percentNum > 100) {
    errors.push(`${fieldName} must be between 0 and 100`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== GENERIC VALIDATION FUNCTIONS ====================

// Generic validation function that routes to specific validators
export const validateField = (fieldName, value, options = {}) => {
  const fieldValidators = {
    'Email ID': validateEmail,
    'Password': validatePassword,
    'Employee ID': validateEmployeeId,
    'Username': validateUsername,
    'First Name': (val) => validateName(val, 'First Name', true),
    'Middle Name': (val) => validateName(val, 'Middle Name', false),
    'Last Name': (val) => validateName(val, 'Last Name', true),
    'Department': (val) => validateDepartment(val, options.departmentMaster || []),
    'Designation': (val) => validateDesignation(val, options.designationMaster || []),
    'Date of Birth': validateDateOfBirth,
    'PAN Number': validatePAN,
    'Aadhaar Number': validateAadhaar,
    'Phone Number': validatePhoneNumber,
    'Address': validateAddress,
    'Emergency Contact Name': validateEmergencyContact,
    'Emergency Phone Number': validateEmergencyPhone,
    'Date of Joining': validateDateOfJoining,
    'Work Location': (val) => validateWorkLocation(val, options.locationMaster || []),
    'Bank Name': (val) => validateBankName(val, options.bankMaster || []),
    'Account Number': validateAccountNumber,
    'IFSC Code': validateIFSC,
    'Branch Name': validateBranchName,
    'Beneficiary Name': validateBeneficiaryName,
    'CTC': validateCTC,
    'PF UAN': validatePFUAN,
    'ESI Number': (val) => validateESINumber(val, options.isRequired || false),
    'Medical Insurance Number': validateMedicalInsurance,
    'Leave Type Name': (val) => validateLeaveType(val, options.leaveMaster || []),
    'No of Days Leave': validateNoOfDaysLeave,
    'Holiday Name': (val) => validateHolidayName(val, options.holidayMaster || []),
    'Salary Basic %': (val) => validatePercentage(val, 'Salary Basic %'),
    'HRA %': (val) => validatePercentage(val, 'HRA %'),
    'PF %': (val) => validatePercentage(val, 'PF %'),
    'Department Name': validateDepartmentName,
    'Designation Name': validateDesignationName
  };

  const validator = fieldValidators[fieldName];
  if (validator) {
    return validator(value);
  }

  // Default validator for fields not explicitly defined
  return {
    isValid: true,
    errors: []
  };
};

// Helper function to validate multiple fields at once
export const validateForm = (formData, validationRules = [], masterData = {}) => {
  const errors = {};
  let isValid = true;

  validationRules.forEach(field => {
    const value = formData[field.name];
    const options = {
      ...masterData,
      isRequired: field.isRequired !== false
    };
    
    const result = validateField(field.displayName || field.name, value, options);
    
    if (!result.isValid) {
      isValid = false;
      errors[field.name] = result.errors;
    }
  });

  return {
    isValid,
    errors
  };
};

// React hook for form validation
export const useFormValidation = (initialData = {}, validationRules = [], masterData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (fieldName, value) => {
    const field = validationRules.find(rule => rule.name === fieldName);
    if (!field) return { isValid: true, errors: [] };

    const options = {
      ...masterData,
      isRequired: field.isRequired !== false
    };

    return validateField(field.displayName || fieldName, value, options);
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    if (touched[fieldName]) {
      const result = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: result.isValid ? [] : result.errors
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const result = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? [] : result.errors
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    validationRules.forEach(field => {
      const value = formData[field.name];
      const options = {
        ...masterData,
        isRequired: field.isRequired !== false
      };
      
      const result = validateField(field.displayName || field.name, value, options);
      
      if (!result.isValid) {
        isValid = false;
        newErrors[field.name] = result.errors;
      }
    });

    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    validationRules.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  };
};

// Export all validation functions
export default {
  // Login Page Validations
  validateEmail,
  validatePassword,
  validateEmployeeId,
  validateUsername,
  
  // Employee Management Validations
  validateName,
  validateDepartment,
  validateDesignation,
  validateDateOfBirth,
  validatePAN,
  validateAadhaar,
  validatePhoneNumber,
  validateAddress,
  validateEmergencyContact,
  validateEmergencyPhone,
  validateDateOfJoining,
  validateWorkLocation,
  
  // Bank Details Validations
  validateBankName,
  validateAccountNumber,
  validateIFSC,
  validateBranchName,
  validateBeneficiaryName,
  
  // Salary & Statutory Validations
  validateCTC,
  validatePFUAN,
  validateESINumber,
  validateMedicalInsurance,
  
  // File Validations
  validateFile,
  
  // Department Management Validations
  validateDepartmentName,
  validateDesignationName,
  
  // Leave Management Validations
  validateLeaveType,
  validateNoOfDaysLeave,
  validateHolidayName,
  validatePercentage,
  
  // Generic Functions
  validateField,
  validateForm,
  useFormValidation
};