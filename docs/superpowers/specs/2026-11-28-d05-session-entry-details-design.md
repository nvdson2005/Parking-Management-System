# D-05 session entry details

## Goal

Help Staff and Managers verify how an entry was identified and who recorded it when reviewing a parking session.

## Scope and behavior

- Add identification method and entry staff name to the existing session detail page.
- Reuse the stored session method and entry staff relation.
- Present labels in English and Vietnamese, matching the active language.
- Keep the existing access rules, plate masking, access logging, and other session details unchanged.

## Acceptance criteria

- A Staff or Manager opening a session sees its method (Plate, QR, or RFID) and entry staff name.
- The new labels and method values use the selected language.
- Existing plate privacy behavior remains unchanged.

## Verification

- Review the updated detail page and both dictionaries for complete localized labels.
- The focused session detail test passed 10/10 and `npm run build` passed on 28 November 2026.
