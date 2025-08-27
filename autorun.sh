#!/bin/bash

# Extract the archive
tar -xzf invoice.tar.gz

# Rename the extracted PDF to a fake executable
mv invoice.pdf invoice.pdf.exe

# Trigger a download (this is a placeholder - actual implementation depends on the environment)
echo "Simulating download of invoice.pdf.exe"
# In a real web server environment, you would set the appropriate headers to force a download.

# Copy the decoy invoice to a location where it can be displayed
cp assets/invoice.pdf decoy_invoice.pdf
echo "Decoy invoice placed at decoy_invoice.pdf"
