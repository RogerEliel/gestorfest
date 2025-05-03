import { supabase } from "@/integrations/supabase/client";

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE_EVENT = 'create_event',
  UPDATE_EVENT = 'update_event',
  DELETE_EVENT = 'delete_event',
  IMPORT_CONTACTS = 'import_contacts',
  SEND_INVITES = 'send_invites',
  UPDATE_INVITATION = 'update_invitation',
  GENERATE_REPORT = 'generate_report',
}

interface AuditLog {
  action: AuditAction;
  details?: Record<string, any>;
  entity_id?: string;
  entity_type?: string;
}

export const logUserAction = async (action: AuditAction, details?: Record<string, any>, entity_id?: string, entity_type?: string) => {
  try {
    // Store audit log in local storage for offline support
    storeLocalAuditLog({ action, details, entity_id, entity_type });
    
    // Also send to server if online
    await supabase.functions.invoke('audit-log', {
      method: 'POST',
      body: { action, details, entity_id, entity_type }
    });
    
    return true;
  } catch (error) {
    console.error('Error logging audit action:', error);
    return false;
  }
};

// Store audit logs locally in case user is offline
const storeLocalAuditLog = (logEntry: AuditLog) => {
  try {
    // Get existing logs
    const existingLogsString = localStorage.getItem('audit-logs');
    const existingLogs = existingLogsString ? JSON.parse(existingLogsString) : [];
    
    // Add new log with timestamp
    const newLog = {
      ...logEntry,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    existingLogs.push(newLog);
    
    // Keep only last 100 logs in local storage
    const trimmedLogs = existingLogs.slice(-100);
    
    // Save back to local storage
    localStorage.setItem('audit-logs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Error storing local audit log:', error);
  }
};

// Function to sync local logs that haven't been sent to server
export const syncLocalAuditLogs = async () => {
  try {
    const existingLogsString = localStorage.getItem('audit-logs');
    if (!existingLogsString) return;
    
    const existingLogs = JSON.parse(existingLogsString);
    const unsyncedLogs = existingLogs.filter((log: any) => !log.synced);
    
    if (unsyncedLogs.length === 0) return;
    
    // Send unsynced logs to server
    const { error } = await supabase.functions.invoke('audit-log-batch', {
      method: 'POST',
      body: { logs: unsyncedLogs }
    });
    
    if (error) throw error;
    
    // Mark logs as synced
    const updatedLogs = existingLogs.map((log: any) => ({
      ...log,
      synced: true
    }));
    
    localStorage.setItem('audit-logs', JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Error syncing local audit logs:', error);
  }
};
