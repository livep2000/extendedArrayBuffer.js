// Experiment : Steel ArrayBuffer prototype it
// Destroy all that was needed, except the extendedArrayBuffer

var newExtendedArrayBuffer = function(byteLength)
	{			//This one is quit nifty thanks Dean Edwards
	var sandBoxNative = function( original, sandboxed )
		{
		var iframe = document.createElement("iframe");
		iframe.style.display= "none";
		iframe.style.width= "0Px;";
		iframe.style.height= "0Px;";
		iframe.style.borderStyle = "none";
		iframe.sandbox = "allow-scripts allow-same-origin";
		document.body.appendChild(iframe);
		frames[frames.length - 1].document.write("<script>parent." + sandboxed + " = "+ original +";<\/script>");
		document.body.removeChild(iframe);
		}
	// create sandboxed extendedArrayBuffer from native ArrayBuffer
	sandBoxNative("ArrayBuffer", "extendedArrayBuffer");
	// Recycled function: retrieves Int8Array part of source ArrayBuffer
	var getInt8Part = function(buffer, byteOffset, length, bytesPerInteger)
		{
		var src8 = new Int8Array( buffer, byteOffset, length * bytesPerInteger)
		var dst8 = new Int8Array(length * bytesPerInteger);
		dst8.set(src8);
		return ( dst8.buffer );
		}
	// Recycled function: retrieve UintArray part of source ArrayBuffer
	var getUint8Part = function(buffer, byteOffset, length, bytesPerInteger)
		{
		var srcU8 = new Uint8Array( buffer, byteOffset, length * bytesPerInteger)
		var dstU8 = new Uint8Array( length * bytesPerInteger);
		dstU8.set(srcU8);
		return ( dstU8.buffer );
		}
	// If Array hase 1 memeber, return only the member, else the array
	var returnSingle = function(input)
		{
		if (input.length === 1)
			{
			return input[0];
			}
		else {return input; }
		}
	// If input is only a number, return array with 1 member
	var acceptSingle = function (input)
		{
		if ( typeof(input) === "number" )
			{
			return ( [input] );
			}
		else 
			{
			return ( input );
			}
		}
	// Get string from source
	extendedArrayBuffer.prototype.getString = function( byteOffset, byteLength) 
		{
		var buf = new Uint8Array( this, byteOffset, byteLength)
		var str = "";
		var ab = new Uint16Array( buf );
		var abLen = ab.length;
		var CHUNK_SIZE = Math.pow(2, 16);
		console.log("chunk size = " + CHUNK_SIZE);
		var offset, len, subab;
		for (offset = 0; offset < abLen; offset += CHUNK_SIZE) 
			{
			len = Math.min(CHUNK_SIZE, abLen-offset);
			subab = ab.subarray(offset, offset+len);
			str += String.fromCharCode.apply(null, subab);
			}
		return (str);
		};

	// Set string in source
	extendedArrayBuffer.prototype.setString = function( str, writePosition ) 
		{
		var bufView = new Uint8Array( this );
		for (var i=0, strLen=str.length; i<strLen; i++) 
			{
			bufView[i + writePosition] = str.charCodeAt(i);
			}
		return str.length;
		};

	extendedArrayBuffer.prototype.setString2 = function( str, writePosition ) 
		{
		var bufView = new Uint16Array( this );
		var cnt =0;
		for (var i=0, strLen=str.length; i<strLen; i+=2) 
			{
			bufView[cnt] =   str.charCodeAt(i +1) * str.charCodeAt(i);
			console.log(bufView[cnt]);
			cnt +=1;
			}
		return str.length;
		};


	// Get Uint8array from source
	extendedArrayBuffer.prototype.getUint8 = function( byteOffset, byteLength) 
		{
		return returnSingle(  new Uint8Array( this, byteOffset, byteLength) );
		};
	// Get Int8Array from source
	extendedArrayBuffer.prototype.getInt8 = function(byteOffset, byteLength) 
		{
		return returnSingle( new Int8Array( this, byteOffset, byteLength) );
		};
	// Get Uint16Array from source
	extendedArrayBuffer.prototype.getUint16 = function(byteOffset, length) 
		{
		var dstU8buffer = getUint8Part(this, byteOffset, length, 2);
		return returnSingle( new Uint16Array( dstU8buffer, 0, length ));
		};
	// Get Int16Array from source
	extendedArrayBuffer.prototype.getInt16 = function(byteOffset, length) 
		{
		var dst8buffer = getInt8Part(this, byteOffset, length, 2);
		return returnSingle( new Int16Array( dst8buffer, 0, length ));
		};
	// Get Uint32Array from source
	extendedArrayBuffer.prototype.getUint32 = function(byteOffset , length)
		{
		var dstU8buffer = getUint8Part(this, byteOffset, length, 4);
		return returnSingle( new Uint32Array( dstU8buffer, 0, length ));
		};
	// Get Int32Array from source
	extendedArrayBuffer.prototype.getInt32 = function(byteOffset , length)
		{
		var dst8buffer = getInt8Part(this, byteOffset, length, 4);
		return returnSingle( new Int32Array( dst8buffer, 0, length ));
		};
	// combine arraybuffer with arraybuffer
	extendedArrayBuffer.prototype.setArrayBuffer = function( bufferToCombine, writePosition )
		{
		bufferToCombine = Uint8Array(bufferToCombine);
		var dstU8 = new Uint8Array( this );
		dstU8.set(bufferToCombine, writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint8array
	extendedArrayBuffer.prototype.setUint8 = function( bufferToCombine, writePosition )
	 	{
		bufferToCombine = new Uint8Array( acceptSingle(bufferToCombine) );
		var dstU8 = new Uint8Array( this );
		dstU8.set(bufferToCombine, writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint16array
	extendedArrayBuffer.prototype.setUint16 = function( bufferToCombine, writePosition )
		{ 
		bufferToCombine = new Uint16Array( acceptSingle(bufferToCombine) );
		var dstU8 = new Uint8Array( this );	
		dstU8.set(new Uint8Array( bufferToCombine.buffer), writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint32array
	extendedArrayBuffer.prototype.setUint32 = function( bufferToCombine, writePosition )
		{
		bufferToCombine = new Uint32Array( acceptSingle(bufferToCombine) );
		var dstU8 = new Uint8Array( this );	
		dstU8.set(new Uint8Array( bufferToCombine.buffer), writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint8array
	extendedArrayBuffer.prototype.setInt8 = function( bufferToCombine, writePosition )
		{
		bufferToCombine = new Int8Array( acceptSingle(bufferToCombine) );
		var dst8 = new Int8Array( this );
		dst8.set(bufferToCombine, writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint16array
	extendedArrayBuffer.prototype.setInt16 = function( bufferToCombine, writePosition )
		{ 
		bufferToCombine = new Int16Array( acceptSingle(bufferToCombine) );
		var dst8 = new Int8Array( this );	
		dst8.set(new Int8Array( bufferToCombine.buffer), writePosition);
		return bufferToCombine.byteLength;
		};
	// combine arraybuffer with uint32array
	extendedArrayBuffer.prototype.setInt32 = function( bufferToCombine, writePosition )
		{
		bufferToCombine = new Int32Array( acceptSingle(bufferToCombine) );
		var dst8 = new Int8Array( this );	
		dst8.set(new Int8Array( bufferToCombine.buffer), writePosition);
		return bufferToCombine.byteLength;
		};
	// return a new initiated instance of extendedArrayBuffer
	var toreturn = new window.extendedArrayBuffer( byteLength );
	window.extendedArrayBuffer = null;	// destroy it 
	delete(window.extendedArrayBuffer);	// detelete it, whatever (not necessary :)
	return toreturn;			// return the original

	}; // createExtendedArrayBuffer
	

