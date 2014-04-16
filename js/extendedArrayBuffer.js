// Experiment : Steel ArrayBuffer prototype it
// Destroy all that was needed, except the extendedArrayBuffer

var newExtendedArrayBuffer = function(byteLength)
	{
	var sandBoxNative = function( original, sandboxed )			//	 This one is quit nifty thanks Dean Edwards
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

	sandBoxNative("ArrayBuffer", "extendedArrayBuffer");

	var getInt8Part = function(buffer, byteOffset, length, bytesPerInteger)
		{
		var src8 = new Int8Array( buffer, byteOffset, length * bytesPerInteger)
		var dst8 = new Int8Array(length * bytesPerInteger);
		dst8.set(src8);
		return ( dst8.buffer );
		}

	var getUint8Part = function(buffer, byteOffset, length, bytesPerInteger)
		{
		var srcU8 = new Uint8Array( buffer, byteOffset, length * bytesPerInteger)
		var dstU8 = new Uint8Array( length * bytesPerInteger);
		dstU8.set(srcU8);
		return ( dstU8.buffer );
		}
	
	var returnSingle = function(input)
		{
		if (input.length === 1)
			{
			return input[0];
			}
		else {return input; }
		}

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

	extendedArrayBuffer.prototype.getString = function( byteOffset, byteLength) 
		{
		var buf = new Uint8Array( this, byteOffset, byteLength)
		var str = "";
		var ab = new Uint16Array( buf );
		var abLen = ab.length;
		var CHUNK_SIZE = Math.pow(2, 16);
		var offset, len, subab;
		for (offset = 0; offset < abLen; offset += CHUNK_SIZE) 
			{
			len = Math.min(CHUNK_SIZE, abLen-offset);
			subab = ab.subarray(offset, offset+len);
			str += String.fromCharCode.apply(null, subab);
			}
		return (str);
		};

	extendedArrayBuffer.prototype.getUint8 = function( byteOffset, byteLength) 
		{
		return returnSingle(  new Uint8Array( this, byteOffset, byteLength) );
		};

	extendedArrayBuffer.prototype.getInt8 = function(byteOffset, byteLength) 
		{
		return returnSingle( new Int8Array( this, byteOffset, byteLength) );
		};

	extendedArrayBuffer.prototype.getUint16 = function(byteOffset, length) // nr of uint 16  
		{
		var dstU8buffer = getUint8Part(this, byteOffset, length, 2);
		return returnSingle( new Uint16Array( dstU8buffer, 0, length ));
		};

	extendedArrayBuffer.prototype.getInt16 = function(byteOffset, length) // nr of uint 16  
		{
		var dst8buffer = getInt8Part(this, byteOffset, length, 2);
		return returnSingle( new Int16Array( dst8buffer, 0, length ));
		};

	extendedArrayBuffer.prototype.getUint32 = function(byteOffset , length)
		{
		var dstU8buffer = getUint8Part(this, byteOffset, length, 4);
		return returnSingle( new Uint32Array( dstU8buffer, 0, length ));
		};

	extendedArrayBuffer.prototype.getInt32 = function(byteOffset , length) // nr of uint 32  
		{
		var dst8buffer = getInt8Part(this, byteOffset, length, 4);
		return returnSingle( new Int32Array( dst8buffer, 0, length ));
		};

	extendedArrayBuffer.prototype.setString = function( str, writePosition ) 
		{
		var dv = new DataView( this );			
		for (var i=0, strLen=str.length; i<strLen; i++) 
			{
			dv.setUint8(writePosition, str.charCodeAt(i), true);
			writePosition += 1;
			}
		};

	extendedArrayBuffer.prototype.setArrayBuffer = function( bufferToCombine, writePosition )	// combine arraybuffer with arraybuffer
		{
		var dv = new DataView( this );
		var source = new Uint8Array(bufferToCombine);
		for (var i = 0; i<source.length;i++)
			{
			dv.setUint8(writePosition, source[i], true);
			writePosition += 1;
			}
		};

	extendedArrayBuffer.prototype.setUint8 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint8array
		{
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setUint8(writePosition, bufferToCombine[i], true);
			writePosition += 1;
			}
		};

	extendedArrayBuffer.prototype.setUint16 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint16array
		{ 
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setUint16(writePosition, bufferToCombine[i], true);
			writePosition += 2;
			}
		};

	extendedArrayBuffer.prototype.setUint32 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint32array
		{
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setUint32(writePosition, bufferToCombine[i], true);
			writePosition += 4;
			}
		};

	extendedArrayBuffer.prototype.setInt8 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint8array
		{
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setInt8(writePosition, bufferToCombine[i], true);
			writePosition += 1;
			}
		};

	extendedArrayBuffer.prototype.setInt16 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint16array
		{ 
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setInt16(writePosition, bufferToCombine[i], true);
			writePosition += 2;
			}
		};

	extendedArrayBuffer.prototype.setInt32 = function( bufferToCombine, writePosition )	// combine arraybuffer with uint32array
		{
		bufferToCombine = acceptSingle(bufferToCombine);
		var dv = new DataView( this );	
		for (var i = 0; i<bufferToCombine.length;i++)
			{
			dv.setInt32(writePosition, bufferToCombine[i], true);
			writePosition += 4;
			}
		};

	var toreturn = new window.extendedArrayBuffer( byteLength );			// return a new initiated instance of extendedArrayBuffer
	window.extendedArrayBuffer = null;										// destroy it 
	delete(window.extendedArrayBuffer);										// detelete it, whatever (not necessary :)
	return toreturn;														// return the original

	}; // createExtendedArrayBuffer
	

