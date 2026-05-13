<?php
// Class to handle account-related database operations
class Account extends Dbh {
    // Get user details
    protected function getUserDetails($userId) {
        error_log("Account: Fetching user details for userID=$userId");

        try {
            // Query to get user details - make sure profile_picture is included
            $query = "SELECT student_id, first_name, last_name, email, phone, dob, gender, address, profile_picture 
                    FROM users 
                    WHERE id = ?;";
            $stmt = $this->connect()->prepare($query);
            if (!$stmt->execute([$userId])) {
                error_log("Account: Failed to fetch user details: " . json_encode($stmt->errorInfo()));
                throw new Exception('stmtfailed');
            }

            // Fetch user details
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$user) {
                error_log("Account: No user found for userID=$userId");
                throw new Exception('usernotfound');
            }
            
            // Debug: Log what was retrieved
            error_log("Account: Retrieved user data - profile_picture: " . ($user['profile_picture'] ?? 'NULL'));
            
            error_log("Account: Successfully fetched user details for userID=$userId");
            return $user;
        } catch (Exception $e) {
            error_log("Account: Exception in getUserDetails: " . $e->getMessage());
            throw $e;
        }

    }

    // Update user profile
    protected function updateUserProfile($userId, $firstName, $lastName, $email, $phone, $dob, $gender, $address, $profilePicture = null) {
        // Log action for debugging
        error_log("Account: Updating profile for userID=$userId, email=$email");

        try {
            // Build query dynamically based on profile picture
            $query = "UPDATE users 
                      SET first_name = ?, last_name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?" . 
                     ($profilePicture ? ", profile_picture = ?" : "") . 
                     " WHERE id = ?;";
            $params = [$firstName, $lastName, $email, $phone, $dob, $gender, $address];
            if ($profilePicture) {
                $params[] = $profilePicture;
                error_log("Account: Including profile picture in update: $profilePicture");
            }
            $params[] = $userId;

            $stmt = $this->connect()->prepare($query);
            if (!$stmt->execute($params)) {
                error_log("Account: Failed to update profile: " . json_encode($stmt->errorInfo()));
                throw new Exception('stmtfailed');
            }

            // Check if update affected any rows - REMOVED strict check as it can be 0 if no changes
            if ($stmt->rowCount() === 0) {
                error_log("Account: Profile update completed but no rows changed (possibly same data) for userID=$userId");
                // Don't throw error - this can happen if data is the same
            }

            // Insert notification
            try {
                $notificationQuery = "INSERT INTO notifications (user_id, type, message) 
                                     VALUES (?, 'Account', ?);";
                $notificationStmt = $this->connect()->prepare($notificationQuery);
                $message = "Your profile was updated successfully.";
                if (!$notificationStmt->execute([$userId, $message])) {
                    error_log("Account: Failed to insert notification: " . json_encode($notificationStmt->errorInfo()));
                    // Don't throw error for notification failure
                }
            } catch (Exception $e) {
                error_log("Account: Exception inserting notification: " . $e->getMessage());
                // Continue anyway - notification failure shouldn't block profile update
            }

            error_log("Account: Successfully updated profile for userID=$userId");
            return true;
        } catch (Exception $e) {
            error_log("Account: Exception in updateUserProfile: " . $e->getMessage());
            throw $e;
        }
    }

    // Change user password - FIXED: Better password verification
    protected function changeUserPassword($userId, $currentPassword, $newPassword) {
        // Log action for debugging
        error_log("Account: Changing password for userID=$userId");

        try {
            // Verify current password
            $query = "SELECT password_hash FROM users WHERE id = ?;";
            $stmt = $this->connect()->prepare($query);
            if (!$stmt->execute([$userId])) {
                error_log("Account: Failed to fetch password: " . json_encode($stmt->errorInfo()));
                throw new Exception('stmtfailed');
            }
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$user) {
                error_log("Account: User not found for password change, userID=$userId");
                throw new Exception('usernotfound');
            }
            
            error_log("Account: Verifying current password for userID=$userId");
            
            if (!password_verify($currentPassword, $user['password_hash'])) {
                error_log("Account: Invalid current password for userID=$userId");
                throw new Exception('invalidcurrentpassword');
            }

            // Update password
            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $updateQuery = "UPDATE users SET password_hash = ? WHERE id = ?;";
            $updateStmt = $this->connect()->prepare($updateQuery);
            if (!$updateStmt->execute([$newPasswordHash, $userId])) {
                error_log("Account: Failed to update password: " . json_encode($updateStmt->errorInfo()));
                throw new Exception('stmtfailed');
            }

            // Insert notification
            try {
                $notificationQuery = "INSERT INTO notifications (user_id, type, message) 
                                     VALUES (?, 'Account', ?);";
                $notificationStmt = $this->connect()->prepare($notificationQuery);
                $message = "Your password was changed successfully.";
                if (!$notificationStmt->execute([$userId, $message])) {
                    error_log("Account: Failed to insert notification: " . json_encode($notificationStmt->errorInfo()));
                    // Don't throw error for notification failure
                }
            } catch (Exception $e) {
                error_log("Account: Exception inserting notification: " . $e->getMessage());
                // Continue anyway
            }

            error_log("Account: Successfully changed password for userID=$userId");
            return true;
        } catch (Exception $e) {
            error_log("Account: Exception in changeUserPassword: " . $e->getMessage());
            throw $e;
        }
    }
}