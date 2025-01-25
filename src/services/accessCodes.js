const mongoose = require('mongoose');
const AccessCode = require('../lib/accessCode'); // Adjust path based on your project structure

//const Video = require('../models/video'); // Adjust path based on your project structure
//const { v4: uuidv4 } = require('uuid'); // Use uuid for generating unique codes

//const { nanoid } = require('nanoid');
//import { nanoid } from 'nanoid';

// Helper function to generate unique access codes
const generateAccessCodes = async (videoId, numberOfCodes) => {
  try {
    const { nanoid } = await import('nanoid');
    const codes = Array.from({ length: numberOfCodes }, () => ({
      code: nanoid(8), // Generate a unique code using UUID
      status: 'active',
    }));
    console.log(codes);

    // Add codes to the AccessCode table
    let accessCodeEntry = await AccessCode.findOne({ videoId }).exec();

    if (accessCodeEntry) {
      // If codes already exist for this video, append new ones
      accessCodeEntry.codes.push(...codes);
    } else {
      // Create a new entry for this video
      accessCodeEntry = new AccessCode({ videoId, codes });
    }

    await accessCodeEntry.save();
    return { message: 'Access codes generated successfully', codes };
  } catch (error) {
    console.error('Error generating access codes:', error);
    throw new Error('Failed to generate access codes');
  }
};

/*const validateAndUseAccessCode = async (code, studentId) => {
  try {
    const accessCodeEntry = await AccessCode.findOne({ 'codes.code': code });

    if (!accessCodeEntry) {
      throw new Error('Access code not found');
    }

    const codeEntry = accessCodeEntry.codes.find((c) => c.code === code);

    if (!codeEntry) {
      throw new Error('Invalid access code');
    }

    if (codeEntry.status !== 'active') {
      throw new Error('Access code is not active');
    }

    // Update the code status and assign the student
    codeEntry.status = 'used';
    codeEntry.assignedTo = studentId;
    codeEntry.usageCount += 1;

    await accessCodeEntry.save();

    return { message: 'Access code validated and used successfully', isValid: true };
  } catch (error) {
    console.error('Error validating access code:', error);
    return { message: error.message, isValid: false };
  }
};*/
const validateAndUseAccessCode = async (videoId, code, studentId) => {
  try {
    // Find the access code entry for the specific videoId and code
    const accessCodeEntry = await AccessCode.findOne({ videoId, 'codes.code': code });

    if (!accessCodeEntry) {
      throw new Error('Access code not found for the given video');
    }

    // Find the specific code entry within the codes array
    const codeEntry = accessCodeEntry.codes.find((c) => c.code === code);

    if (!codeEntry || codeEntry && codeEntry.usageCount == 2 ) {
      codeEntry.status = "expired";
      await accessCodeEntry.save();
      throw new Error('Invalid access code');
    }

    // Check if the code is already assigned to the same user
    if (codeEntry.assignedTo && codeEntry.assignedTo.toString() === studentId) {
      // If already assigned to the same user, update usage count
      codeEntry.usageCount += 1;
      await accessCodeEntry.save();

      return {
        message: 'Access code already assigned to this user. Usage count updated.',
        isValid: true,
        usageCount: codeEntry.usageCount,
      };
    }

    // Check if the code is already assigned to another user
    if (codeEntry.assignedTo && codeEntry.assignedTo.toString() !== studentId) {
      throw new Error('Access code is already assigned to another user');
    }

    // If the code is active and not yet assigned, assign it to the user
    if (codeEntry.status === 'active') {
      codeEntry.status = 'used';
      codeEntry.assignedTo = studentId;
      codeEntry.usageCount += 1;

      await accessCodeEntry.save();

      return {
        message: 'Access code validated, assigned to user, and usage count updated.',
        isValid: true,
        usageCount: codeEntry.usageCount,
      };
    }

    // If the code is not active
    throw new Error('Access code is not active');
  } catch (error) {
    console.error('Error validating access code:', error);
    return { message: error.message, isValid: false };
  }
};


// Assign an access code to a student
const assignAccessCode = async (videoId, studentId) => {
  try {
    const accessCodeEntry = await AccessCode.findOne({ videoId }).exec();

    if (!accessCodeEntry) {
      throw new Error('No access codes found for this video');
    }

    const availableCode = accessCodeEntry.codes.find(code => code.status === 'active' && !code.assignedTo).exec();

    if (!availableCode) {
      throw new Error('No available access codes for this video');
    }

    availableCode.status = 'used';
    availableCode.assignedTo = studentId;

    await accessCodeEntry.save();

    return { message: 'Access code assigned successfully', code: availableCode.code };
  } catch (error) {
    console.error('Error assigning access code:', error);
    throw new Error('Failed to assign access code');
  }
};

// Update usage count of a code
/*const updateCodeUsage = async (code) => {
  try {
    const accessCodeEntry = await AccessCode.findOne({ 'codes.code': code });

    if (!accessCodeEntry) {
      throw new Error('Access code not found');
    }

    const codeEntry = accessCodeEntry.codes.find(c => c.code === code);

    if (!codeEntry) {
      throw new Error('Code entry not found');
    }

    if (codeEntry.status !== 'used') {
      throw new Error('Code is not active or used yet');
    }

    codeEntry.usageCount += 1;

    await accessCodeEntry.save();

    return { message: 'Code usage updated successfully', usageCount: codeEntry.usageCount };
  } catch (error) {
    console.error('Error updating code usage:', error);
    throw new Error('Failed to update code usage');
  }
};*/

// Retrieve all codes for a video
const getCodesByVideo = async (videoId) => {
  try {
    const accessCodeEntry = await AccessCode.findOne({ videoId }).populate('videoId', 'title youtubeLink');

    if (!accessCodeEntry) {
      throw new Error('No codes found for this video');
    }

    return { video: accessCodeEntry.videoId, codes: accessCodeEntry.codes };
  } catch (error) {
    console.error('Error retrieving codes:', error);
    throw new Error('Failed to retrieve codes');
  }
};

// Expire all codes for a video
const expireAllCodes = async (videoId) => {
  try {
    const accessCodeEntry = await AccessCode.findOne({ videoId });

    if (!accessCodeEntry) {
      throw new Error('No access codes found for this video');
    }

    accessCodeEntry.codes.forEach(code => {
      if (code.status === 'active') {
        code.status = 'expired';
      }
    });

    await accessCodeEntry.save();

    return { message: 'All active codes expired successfully' };
  } catch (error) {
    console.error('Error expiring codes:', error);
    throw new Error('Failed to expire codes');
  }
};

module.exports = {
  generateAccessCodes,
  validateAndUseAccessCode,
  assignAccessCode,
  getCodesByVideo,
  expireAllCodes,
};

