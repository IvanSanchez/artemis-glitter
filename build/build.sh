#!/usr/bin/bash

# Script to download the node-webkit binaries, zip everything, and make
#   distributable files.

glitter_version=0.1.0


# Cleanup previous build files
rm artemis-glitter-*
rm artemis-glitter.nw


# Run 'npm install' and 'npm prune' to fix up dependencies
cd ..
npm install
npm prune
cd build

# Zip everything into a .nw file
cd ..
zip -r build/artemis-glitter.nw \
    *.js *.html *.json node_modules packets \
    public routes views LICENSE package.json README.md
cd build
    
# Definition of target platforms and peculiarities of each binary

nwversion=0.9.2

platforms[0]=linux-ia32
platforms[1]=linux-x64
platforms[2]=win-ia32
# platforms[3]=osx-ia32

extensions[0]=tar.gz
extensions[1]=tar.gz
extensions[2]=zip
# extensions[3]=zip

runtimes[0]=nw
runtimes[1]=nw
runtimes[2]=nw.exe
# runtimes[3]=nwsnapshot

outputfile[0]=artemis-glitter-linux-ia32
outputfile[1]=artemis-glitter-linux-x64
outputfile[2]=artemis-glitter-win-ia32.exe
# outputfile[3]=artemis-glitter-osx-ia32.app



# Download, uncompress the binary, append the .nw file
# Note the {0..2} in the loop: change it to {0..3} when building for OSX too.
for i in {0..2}; do
	platform=${platforms[$i]};
	extension=${extensions[$i]};
	runtime=${runtimes[$i]}
	
	echo Now building node-webkit package for $platform
	
	nwfilename=node-webkit-v${nwversion}-${platform}.${extension}
	
	if [[ ! -f $nwfilename ]]; then
		url=http://dl.node-webkit.org/v${nwversion}/${nwfilename}
		echo Downloading node-webkit version $version for $platform from $url;
		wget -c $url;
	fi

	if [[ ! -f $nwfilename ]]; then
		echo Could not download node-webkit! Aborting!
		exit -1
	fi
		
	
	# Uncompress
	if [ "$extension" = "tar.gz" ]; then
		echo "Untarring..."
		tar --skip-old-files -zxvf $nwfilename
	else
		echo "Unzipping..."
		mkdir -p node-webkit-v${nwversion}-${platform}
		unzip -n $nwfilename -d node-webkit-v${nwversion}-${platform}
	fi
	
	# Append the .nw file to the node-webkit runtime
	
	echo "Appending..."
	
	cat node-webkit-v${nwversion}-${platform}/$runtime artemis-glitter.nw > ${outputfile[$i]}
	chmod +x ${outputfile[$i]}
	
	echo "Compressing everything needed for a releaseable .zip"
	zip -j artemis-glitter-${glitter_version}-$platform.zip \
		${outputfile[$i]} \
		node-webkit-v${nwversion}-${platform}/nw.pak \
		../README.md \
		../LICENSE
		
	
done




