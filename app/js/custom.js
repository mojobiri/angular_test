'use strict';

function handleFile(e) {
    console.log("Handle file called.");
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    var reader = new FileReader;
    reader.onload = function (event) {
        console.log("File loaded.");
        $("#image").load(function(){
            console.log("Image loaded.");
            console.log( this.width, this.height );
            canvas.width = this.width*.25;
            canvas.height = this.height*.25;

            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

            /*
                now, if you just wanna upload it, no problem... that works fine, just no preview :(
                the code below will post the image correctly. here is what is on my sinatra server:

                post '/mobileupload' do
                    if params[:image]
                        uuid = UUIDTools::UUID.random_create.to_s

                        File.open('test.jpeg', 'wb') do|f|
                          f.write(Base64.decode64(params[:image]))
                        end

                        s3_url = Helpers.s3_upload( Base64.decode64(params[:image]), @@S3_BUCKET, ".jpeg", uuid )

                        puts s3_url

                        return { :result => "success", :msg => s3_url }.to_json
                    end
                end
            */

            // $.ajax({
            //     type: 'POST',
            //     url: '/mobileupload',
            //     dataType: "json",
            //     data: { image: reader.result.replace(/^data:image\/(png|jpeg);base64,/, "") }, //wtf do you have to do this?
            //     success: function(resp){
            //         if( resp["result"] && resp["result"] == "success") {
            //             var msg = trash.createMessage("image",resp["msg"]);
            //             trash.trashio.sendMessage(msg);
            //         }
            //     }
            // });
        });

        // this was done in an attempt to get around a mobile safari bug... no dice though
        // so you could just image = new Image(); image.src = "blarg";
        $("#image").attr("src",reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
}

$(document).ready(function(){
    console.log("Document ready.");
    $("#file").change(function(event){
        handleFile(event);
    });
});