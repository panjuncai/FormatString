const fs = require('fs');
const path = require('path');

/**
 * 文本格式化脚本
 * 功能：将折行的句子合并到一行，删除空行
 */

function formatText(inputText) {
    // 按行分割文本
    const lines = inputText.split('\n');
    const result = [];
    let currentParagraph = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 如果是空行，结束当前段落
        if (line === '') {
            if (currentParagraph.length > 0) {
                // 将当前段落的所有行合并为一行
                result.push(currentParagraph.join(' '));
                currentParagraph = [];
            }
            // 删除空行，不添加到结果中
        } else {
            // 非空行，添加到当前段落
            currentParagraph.push(line);
        }
    }
    
    // 处理最后一个段落（如果文件末尾没有空行）
    if (currentParagraph.length > 0) {
        result.push(currentParagraph.join(' '));
    }
    
    return result.join('\n');
}

function processFile(inputPath, outputPath = null) {
    try {
        // 读取输入文件
        const inputText = fs.readFileSync(inputPath, 'utf8');
        
        // 格式化文本
        const formattedText = formatText(inputText);
        
        // 确定输出文件路径
        if (!outputPath) {
            const ext = path.extname(inputPath);
            const name = path.basename(inputPath, ext);
            const dir = path.dirname(inputPath);
            outputPath = path.join(dir, `${name}_formatted${ext}`);
        }
        
        // 写入输出文件
        fs.writeFileSync(outputPath, formattedText, 'utf8');
        
        console.log(`✅ 文件处理完成！`);
        console.log(`📁 输入文件: ${inputPath}`);
        console.log(`📁 输出文件: ${outputPath}`);
        
        return outputPath;
    } catch (error) {
        console.error('❌ 处理文件时出错:', error.message);
        process.exit(1);
    }
}

// 命令行使用
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
📖 文本格式化工具

用法:
  node text-formatter.js <输入文件> [输出文件]

示例:
  node text-formatter.js novel.txt
  node text-formatter.js novel.txt formatted_novel.txt

功能:
  - 将折行的句子合并到一行
  - 删除空行，使文本更紧凑
  - 自动生成输出文件名（如果未指定）
        `);
        process.exit(0);
    }
    
    const inputFile = args[0];
    const outputFile = args[1] || null;
    
    // 检查输入文件是否存在
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ 输入文件不存在: ${inputFile}`);
        process.exit(1);
    }
    
    processFile(inputFile, outputFile);
}

module.exports = { formatText, processFile };
