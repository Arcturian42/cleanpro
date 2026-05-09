# Security Spec: CRM Propreté

## Data Invariants
1. **Prospects**: 
   - Must have a `companyName` and `stage`.
   - `score` must be between 0 and 100.
   - `suggestedByAI` is immutable after creation.
   - Access: Admins and Managers can read/write.
2. **Opportunities**:
   - Must belong to a valid `prospectId` or `clientId`.
   - `value` must be positive.
   - `probability` must be 0-100.
   - Access: Admins and Managers.
3. **CRM Events**:
   - Must have `start`, `end`, and `type`.
   - `assignedTo` must be a list of user IDs.
   - Access: All authenticated team members.

## The "Dirty Dozen" Payloads (Targeting Rejection)
1. **Identity Spoofing**: Creating a prospect as another user (UID mismatch).
2. **Resource Poisoning**: Large strings (1MB+) in `companyName`.
3. **Ghost Fields**: Adding `isVerified: true` to a prospect via client SDK.
4. **Invalid Score**: Setting `score: 999`.
5. **Orphaned Opportunity**: Creating an opportunity without a linking ID.
6. **Negative Value**: Setting opportunity `value: -5000`.
7. **Stage Jump**: (Currently not strictly enforced, but good to test).
8. **PII Leak**: Unauthenticated user reading the `crm_team` collection.
9. **Unverified Email**: A user with `email_verified: false` attempting to delete a client.
10. **System Field Update**: Manually changing `suggestedByAI` to `false`.
11. **Massive List**: Injecting 1000 items into `assignedTo` in an event.
12. **Unauthorized Metadata**: Trying to write into the `test/connection` doc.

## Test Runner (Logic Check)
The rules will ensure `PERMISSION_DENIED` for all above cases.
