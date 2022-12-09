var ProtoUtils = {
    load: function(protoUrl, packageName, fieldName, fileUrl, callback) {
        protobuf.load(protoUrl, function(err, root) {
            if (err) {
                throw err;
            }
            var message = root.lookupType(packageName);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', fileUrl, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
                var result = new Uint8Array(xhr.response);
                if (result.length === 0) {
                    return;
                }
                var readerData = new protobuf.Reader(result);
                var data = message.decode(readerData)[fieldName];
                if (typeof(callback) === 'function') {
                    callback(data);
                }
            };
            xhr.send();
        });
    }
};