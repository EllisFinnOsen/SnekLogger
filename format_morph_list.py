input_file = "C:/Cmder/Projects/SnekLogger/src/constants/2CleanedMorphTypes.js"
output_file = "C:/Cmder/Projects/SnekLogger/src/constants/formattedMorphTypes.js"


with open(input_file, "r") as infile, open(output_file, "w") as outfile:
    outfile.write('export const BALLPYTHON_MORPH_TYPES = [\n')
    for line in infile:
        morph_name = line.strip()
        if morph_name:  # Ensure the line is not empty
            outfile.write(f'  "{morph_name}",\n')
    outfile.write('];\n')

print("Morph types formatted and saved to", output_file)