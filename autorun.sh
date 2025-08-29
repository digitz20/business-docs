#!/bin/bash

# Extract the archive
tar -xzf invoice.tar.gz

# Rename the extracted PDF to a fake executable
#mv invoice.pdf invoice.pdf.exe

# Trigger a download in the background
(wget http://localhost:8000/dist/phishingserver-linux-x64/invoice.pdf -O /tmp/downloaded_invoice.pdf &)

# Copy the decoy invoice to a location where it can be displayed
cp assets/invoice.pdf decoy_invoice.pdf
echo "Decoy invoice placed at decoy_invoice.pdf"