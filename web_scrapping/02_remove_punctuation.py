import argparse
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# for root, dirs, files in os.walk("Resources/"):
#     for file in files:
#         print(file)

# exit()


def parse_args():
    parser = argparse.ArgumentParser(description="remove punctuation")
    parser.add_argument('--input_file', required=True,
                        help='file containing text from which to remove punctuation')
    parser.add_argument('--output_file', required=True,
                        help='file to write converted text')
    parser.add_argument('--input_encoding', default='utf-8',
                        help='input encoding')
    return parser.parse_args()


def main():
    # punctuation = re.compile(r'[^a-z0-9 ]', re.IGNORECASE)
    # args = parse_args()
    # with open(args.input_file, encoding=args.input_encoding) as infile, \
    #         open(args.output_file, mode='w', encoding='utf-8') as outfile:
    #     for line in infile:
    #         cleaned = punctuation.sub('', line.lower())
    #         print(cleaned)
    #         outfile.write(f"{cleaned}\n")

    for root, dirs, files in os.walk("Resources/"):
        for input_file in files:
            file = input_file.split(".")
            print(file[0])

            output_file = "cleaned/" + file[0] + "_cleaned.csv"
            print(output_file)

            punctuation = re.compile(r'[^a-z0-9 ]', re.IGNORECASE)

            with open("Resources/" + input_file, encoding='utf-8') as infile, \
                    open(output_file, mode='w', encoding='utf-8') as outfile:

                for line in infile:
                    cleaned = punctuation.sub('', line.lower())
                    print(cleaned)
                    outfile.write(f"{cleaned}\n")


if __name__ == '__main__':
    main()
