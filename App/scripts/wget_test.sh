wget https://freetestdata.com/wp-content/uploads/2022/02/Free_Test_Data_1MB_MP4.mp4 -e use_proxy=yes -e https_proxy=$1 2>&1 | grep -o "[0-9.]\+ [KM]*B/s"
rm -f Free_Test_Data_1MB_MP4.mp4
