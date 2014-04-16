extendedArrayBuffer.js
======================

Get and set anyting in HTML5 ArrayBuffer.

Goal of this experiment:

- Create extended, sanboxed ArrayBuffer.
- Set anything into this buffer arraybuffer, string, int8, uint8, int16, uint16, int32 or uint32.
- At any BYTE position in that buffer.
- Extract anything from the buffer from any BYTE position.
- No traces of the prototyped instance.

Please look at the test.html for examples and tests.

Use this code free, a reference would be nice. I am sure this is not IE proof, who cares....

Imre Biacsics 2014

Usage:

Keep in mind: The principal of sanboxing by the use of an Iframe came from Dean Edwards. (See: http://dean.edwards.name/weblog/2006/11/sandbox/ )

Therefore it only works after the dom is loaded. So, wrap your code in the onload event or use Jquery's 

$(function() 
    { 
    // your code  
    });

Creating the newExtendedArrayBuffer is as simple as:

var sourceBuffer = newExtendedArrayBuffer(50); 

Thank's to Dean Edward this prototyped ArrayBuffer hase no effect on the native ArrayBuffer, and even the extendedArrayBuffer that was stolen from the iframe is not present in any scope after is was created, used and destroyed. This is also true for the created Iframe, that was removed after usage.

The sourceBuffer now acts as a native ArrayBuffer, but is extended with the following functions:

```javascript
sourceBuffer.setInt8( Int8Input, writePosition );
sourceBuffer.setUint8( Uint8Input, writePosition );
sourceBuffer.setInt16( Int16input, writePosition );
sourceBuffer.setUint16( Uint16Input, writePosition );
sourceBuffer.setInt32( Int32Input, writePosition );
sourceBuffer.setUInt32( Uint32Input, writePosition );
sourceBuffer.setString( stringInput, writePosition );
```

The input can be: 

1. Normal Array of (U)int(8, 16, 32) values.
2. (U)int(8, 16, 32)Array.
3. Single value of (U)int(8, 16, 32).
4. A string. (in case of setString).

All that is send to the source will be (over)writing the values in the sourceBuffer starting at 'writeposition' in BYTES, to the end of the input. 

The equavalent getters:

```javascript
newBuffer = sourceBuffer.getInt8( readPosition, length );
newBuffer = sourceBuffer.getUInt8( readPosition, length );
newBuffer = sourceBuffer.getInt16( readPosition, length );
newBuffer = sourceBuffer.getUInt16( readPosition, length );
newBuffer = sourceBuffer.getInt32( readPosition, length );
newBuffer = sourceBuffer.getUInt32( readPosition, length );
newBuffer = sourceBuffer.getString( readPosition, length );
```

The returned 'newbuffer' can be:

1. A new (U)int(8, 16, 32)Array.
2. A single (U)int(8, 16, 32) value. (if length = 1)
3. A string. (in case of getString)

'readPosition' is alway's in BYTES.
'length' in the corresponding integer type.

So: if you want 2 integers returned of type Uint16, from byte 3.

```javascript
newBuffer = sourceBuffer.getUint16( 3, 2 );
For examples can give: [2000, 3000]
```

If the length of the result == 1, then it returnes only the value.

```javascript
newBuffer = sourceBuffer.getUint16( 3, 1 );
For example can give : 2000 (only the Uint value of byte 3 & 4) 
```
