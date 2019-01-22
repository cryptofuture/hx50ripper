XZ_OPT=-9 tar -Jcvf ./hx50ripper-linux32.tar.xz ./linux32/
XZ_OPT=-9 tar -Jcvf ./hx50ripper-linux64.tar.xz ./linux64/
zip -9 -r ./hx50ripper-osx64.zip ./osx64
7z a -sfx7zWin32.sfx ./hx50ripper-windows-x64.exe ./win64
7z a -sfx7zWin32.sfx ./hx50ripper-windows-x32.exe ./win32