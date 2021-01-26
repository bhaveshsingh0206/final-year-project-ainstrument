import os
import spleeter
from scipy.io import wavfile
from tqdm import tqdm
import numpy as np

class VocalExtraction:
    def __init__(self,  song, songName):
        self.song = song
        self.songName = songName
        self.destinationPath = ''
        self.extractedDestinationPath = ''
    
    def extractVocal(self):
        print("Extracting Vocals......")
        stream = os.popen('spleeter separate -p spleeter:2stems -o output '+self.song)
        output = stream.read()
        print(output)
        print('Vocals are Extracted!!!!!!')
    
    def trimExtractedVocal(self):
        print('Trimming the extracted vocals.....')
        self.extractedDestinationPath = './output/'+self.songName+'/vocals.wav'
        samplingFrequency, signalData = wavfile.read(self.extractedDestinationPath)
        songData = []
        for i in tqdm(signalData):
            if abs(i[0])+abs(i[1])>20:
                songData.append(i)
        songData = np.array(songData)
        songData = songData.astype(np.int16)
        self.destinationPath = './Songs/TrimmedVocals/'+self.songName+'.wav'
        wavfile.write(self.destinationPath, samplingFrequency, songData)
        print('Module 1 Completed!!!!!')


def main():
    songName = input('Please enter the song name\n')
    song = './Songs/'+songName+'.mp3'
    obj = VocalExtraction(song, songName)
    # obj.extractVocal()
    obj.trimExtractedVocal()

if __name__ == "__main__":
    main()