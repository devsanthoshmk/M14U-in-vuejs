import os 
import sys

import qrcode
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(('8.8.8.8', 80))
local_ip = s.getsockname()[0]
s.close()
qr = qrcode.QRCode(
version=1,
error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=1,
    border=1,)

    # Add data to the QR code
qr.add_data("http://"+local_ip+':8000')
print("http://"+local_ip+':8000')
qr.make(fit=True)
    
    # Generate and display the QR code in ASCII
qr.print_ascii()

os.system('gunicorn --bind 0.0.0.0:8000 app:app')