# GSOC 2020: Writing a FLIF Decoder and Encoder for [FFmpeg](https://ffmpeg.org)

[Free Lossless Image Format][1], or FLIF is the precursor to
[JPEG XL][2] and [FUIF][3].
It claims to have a higher level of compression or lower file size than
conventional lossless image formats like PNG, Lossless JPEG 2000, etc.
FLIF and FUIF development has been stopped in favour of JPEG XL.

[The task was to write an encoder and decoder for this format for FFmpeg.][4]

## Authors
This project was undertaken by two people, which is apparently unusual for GSOC:

* [Anamitra Ghorui](https://github.com/daujerrine/)
* [Kartik K. Khullar](https://github.com/kartikkhullar)

Both of whom had submitted independent proposals for the same project.
The public repository being used for communication during development is available
[here][5].

## Project Status as of 23rd August 2020
```
$ > git diff --stat HEAD~4
 Changelog                      |    3 +-
 configure                      |    1 +
 doc/general.texi               |    2 +
 libavcodec/Makefile            |    3 +
 libavcodec/allcodecs.c         |    1 +
 libavcodec/codec_desc.c        |    7 +
 libavcodec/codec_id.h          |    1 +
 libavcodec/flif16.c            |  204 +++
 libavcodec/flif16.h            |  287 ++++
 libavcodec/flif16_parser.c     |  193 +++
 libavcodec/flif16_rangecoder.c |  800 +++++++++++
 libavcodec/flif16_rangecoder.h |  400 ++++++
 libavcodec/flif16_transform.c  | 2895 ++++++++++++++++++++++++++++++++++++++++
 libavcodec/flif16_transform.h  |  124 ++
 libavcodec/flif16dec.c         | 1764 ++++++++++++++++++++++++
 libavcodec/parsers.c           |    1 +
 libavcodec/version.h           |    2 +-
 libavformat/Makefile           |    1 +
 libavformat/allformats.c       |    1 +
 libavformat/flifdec.c          |  431 ++++++
 libavformat/version.h          |    2 +-
 21 files changed, 7120 insertions(+), 3 deletions(-)
```
* The decoder is complete and can decode all tested FLIF files with slightly
  better performance efficiency and better memory efficiency than
  [the reference decoder][6].
* The decoder has however not yet been merged into FFmpeg's upstream repository.
* The encoder is now being written. It will not be completed within the GSOC
  period.

## List of Public Submissions of Sourcecode
This is a list of links to the iterations of the source code posted to the
development channels of FFmpeg. The latest iteration is version 6.
(faulty patches are not shown)
```
v3:
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/267742.html

v5:
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/267920.html
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/267921.html
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/267922.html

v6:
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/268473.html
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/268474.html
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/268475.html
http://ffmpeg.org/pipermail/ffmpeg-devel/2020-August/268476.html
```

## Author Comments

### Regarding FLIF
* FLIF's [Reference Specification][7] is inadequate for
  actually writing a working codec for the format. [The reference codec][6]
  is how most of the working and data documentation was derived while writing the
  codec.
* FLIF's reference codec is written in C++. From personal observation, the whole
  codec had been written poorly, both in terms of cosmetics and logic. While due
  to our inexperience we haven't written something that can be considered very
  elegant as of now, we believe that the code is, at the very least, more
  organised and logically sound than the reference codec.
* The disorganised manner the sourcecode was written in was also a cause of
  impedance in workflow.

### Regarding FFmpeg
Developing for FFmpeg requires the interested party to read through a lot of the
existing code base and refering to existing components of the same type for
which one wants to develop, which I think is common and required for any
software project.

However I think there could be a few more pointers as to what a novice developer
has to do, such as being told to expect reading through a lot of source code,
and what files must one refer to if one wants to develop a component.

In the initial stages of working for this project, I was in a disarray as to
what to do and where to start from. Understanding what a component even does was
a large part of the time spent.

For example, The description of `libavformat` in FFmpeg's documentation says that it
deals with format *demuxers, muxers and I/O*, which means that, say for a video file,
the audio and video streams are separated (or demuxed) or joined together (muxed)
for processing into decoders. This is the primary purpose of `libavformat`, but
its usage of the term (de)muxer is broader than that.

A demuxer in `libavformat` is also responsible for probing the said format,
reading the header of the format, and, of course, what is sent to the decoder
as the packet. All of this could have been inferred from the phrase 'I/O' in the
description but I initially did not make the connection. This all makes sense
when one gets the idea of a clear distinction between *container formats* (eg.
all video files with sound such as webm) and *encoding formats* (the format of
an audio or a video stream), which I did have an intuitive sense of, but
wasn't articulate. A lot of the confusion came from the meaning of the term
demuxer and whether or not it is used for only container formats or encoding
formats as well. This brings us to the next section:

### Regarding Us
*Kartik has made his own comments [here][kartik]. Please check them out.*

Maybe a lot of the above problems could have been completely avoided and would
have saved our time if we had went through the FFmpeg manpage thoroughly as well
as rest of the documentation (non-API).

My (Anamitra) experience with FFmpeg before the project was limited to clipping
videos, extracting individual frames from gifs, conversion between image formats
and reducing file sizes of videos, all of which I assume are the most common use
cases of FFmpeg. Therefore I did not have much other than a superficial 
understanding of FFmpeg.

However, after working on the project for about half to one month, a lot of the
on-site documentation now seems obvious to me. This was after having
to go through the sourcecode of concerned files again and again and after
writing a working template of the decoder by hand. The [FFmpeg codec HOWTO][8]
on MultimediaWiki does give useful pointers, but can be updated to provide a
better description on how to write codecs for still image formats and gif like
formats, which was the main hurdle for understanding in the context of our project,
and in general a better anatomy of FFmpeg itself (which the manpages do provide,
but not in a very direct manner and in the sense of the internal API itself). I
have started to write a document about this for my own reference.

In conclusion, we think there is a need for slightly better developer
documentation, and providing pointers to new developers and a description what
to expect while trying to develop for the code base. However, I think the 
hurdles I had encountered while developing for FFmpeg (and still am) are 
necessary to pass through for any developer to learn two important things:

1. How to discover things by oneself.
2. How to deduce, derive and figure out things by either testing or simply
   reading through the code.

Talking with others (other than ourselves) never really took a center stage
during the project (which the size and nature of the project had a hand in, and
because of which we could not frequently send out patches). Most of what we were
able to do was by reading through source code of FLIF and FFmpeg.

### Regarding the Project
*Kartik has made his own comments [here][kartik]. Please check them out.*

* Time spent on the project, as inferrable form previous sections,
  had significantly consisted of deducing how the format is actually encoded
  from the reference decoder.
* A large chunk of time was lost in understanding and translating the code of the
  interlaced decoder. The reference decoder had written it in a very convoluted
  manner and was order of magnitudes more convoluted than the non interlaced
  decoder. A few redundant functions that weren't even used in decoding were
  present. This was during July.

### Technical Comments
One of the main decisions made while writing the decoder was to convert it
into a state machine, such that it can save states between intermittent
packets. This was done because FLIF does not provide a simple method to
determine the end of the file bitstream, since the entirety of the image data
has been entropy coded. Aditionally, the whole frame data has been [interleaved][devel-interleave],
which makes it impossible to split the data into frames without reading the
whole of the image data first.

The reference decoder allocates frame data for duplicate frames and copies
frame data into them. We could not find one reason why would one do this. So,
at the very least, in this aspect, our decoder is more memory efficient.

The reference decoder crashes on certain files while trying to decode eXmp
metadata. This does not happen with our decoder.

We may eventually rewrite the FLIF specification, such that the components are
much clearer.

## Benefits of the Project
* JPEG XL uses an entropy coding method [similar to MANIAC][9], and probably shares a
  lot of other similar components as well. If work on implementing JPEG XL in
  FFmpeg is initiated sometime in the future, this codec can be used as a base or
  reference for doing it.
* Very much improbable, but it may result in a bit more adoption of FLIF by
  people.

## Future Work
1. The encoder, which is being written.
2. As mentioned before, I (Anamitra) have started to write a document about the
   anatomy of FFmpeg. This is mostly for my own reference and learning, but I
   hope it to be of help to others.
3. Make the decoder stop at a certain zoomlevel, interpolate the data and
   produce a lower quality image for an interlaced FLIF image.

## Additional Points
* The original paper on rangecoders by G. N. N. Martin was retypeset in LaTeX by 
  us and is available [here][10].
* This file is mirrored [here][11].

[1]:  https://flif.info/
[2]:  https://jpeg.org/jpegxl/index.html
[3]:  https://github.com/cloudinary/fuif
[4]:  https://trac.ffmpeg.org/wiki/SponsoringPrograms/GSoC/2020#FLIFDecoderandEncoder
[5]:  https://github.com/daujerrine/ffmpeg
[6]:  https://github.com/FLIF-hub/FLIF
[7]:  https://flif.info/spec.html
[8]:  https://wiki.multimedia.cx/index.php/FFmpeg_codec_HOWTO
[9]:  https://gitter.im/FLIF-hub/FLIF?at=5d5599a2beba830fff9b3824
[10]: https://aghorui.github.io/stuff/docs/ffmpeg-flif-gsoc-2020/renc.pdf
[11]: https://aghorui.github.io/stuff/docs/ffmpeg-flif-gsoc-2020/

[kartik]: https://gist.github.com/kartikkhullar/394183a8d29ce72494e31ff8024369bd
[devel-interleave]: https://ffmpeg.org/pipermail/ffmpeg-devel/2020-February/257797.html